const Payments = {
  interval: null,
  windowReference: null,
  // This is here to prevent notification spam; purchase canceling can be called multiple times before the first
  // call's Promise is settled
  hasCanceled: false,

  // Only called from clicking the "Buy More" button in the Shop tab
  buyMoreSTD: () => {
    GameUI.notify.error("Could not contact payment server!", 10000);
  },

  // Sends a request to purchase a STD upgrade, returning true if successful (and syncs data), false if not
  async buyUpgrade(upgradeKey, cosmeticName) {
    if (!Cloud.loggedIn) return false;
    let res;
    try {
      res = await fetch(`${STD_BACKEND_URL}/upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: Cloud.user.id,
          upgrade: upgradeKey,
          extraData: {
            requestedSet: cosmeticName,
            fullCompletions: player.records.fullGameCompletions
          }
        })
      });
    } catch (e) {
      GameUI.notify.error("Unable to spend STD coins on upgrade!", 10000);
      return false;
    }
    const stdData = await res.json();
    // The "not enough STDs" message should only show up if the player modifies costs on the frontend and forces the
    // game to send a request despite not actually having enough STDs. The cost check is done again on the backend
    if (stdData.success) GameUI.notify.info(`Successfully spent ${stdData.amountSpent} STD coins`, 10000);
    else GameUI.notify.error(stdData.error ?? "Unable to purchase upgrade", 10000);
    ShopPurchaseData.syncSTD(false, stdData.data);
    return stdData.success;
  },

  // Explicitly cancels purchases if the player chooses to, they take too long to resolve, or the page is closed
  async cancelPurchase(isTimeout) {
    if (this.hasCanceled) return;
    Payments.windowReference?.close();
    Payments.clearInterval();
    try {
      await fetch(`${STD_BACKEND_URL}/expire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionId: player.IAP.checkoutSession.id })
      });
    } catch (e) {
      GameUI.notify.error("Could not contact payment server!", 10000);
    }
    if (isTimeout) GameUI.notify.error("Purchase took too long to resolve!", 10000);
    player.IAP.checkoutSession = { id: false };
    GameStorage.save();
    this.hasCanceled = false;
  },

  // Removes the repeating checker and page-close listener for if payments have been resolved
  clearInterval() {
    clearInterval(Payments.interval);
    window.onbeforeunload = null;
  }
};

export default Payments;
