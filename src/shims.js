import CodeMirror from "codemirror/lib/codemirror";
import Decimal from "break_infinity.js";
import Vue from "vue";

import "codemirror/addon/mode/simple";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/lint/lint";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/edit/closebrackets";

import eruda from "eruda";

window.CodeMirror = CodeMirror;
window.Decimal = Decimal;
window.Vue = Vue;

eruda.init();