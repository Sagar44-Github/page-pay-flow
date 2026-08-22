import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as cn } from "./button-BYtLCDFZ.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-BSpiKaU7.js
var import_jsx_runtime = require_jsx_runtime();
var motionTags = {
	div: motion.div,
	section: motion.section,
	article: motion.article,
	li: motion.li
};
function Reveal({ children, className, delay = 0, as = "div" }) {
	const Component = motionTags[as];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, {
		initial: {
			opacity: 0,
			y: 28
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			amount: .12,
			margin: "0px 0px -10% 0px"
		},
		transition: {
			duration: .65,
			delay: delay / 1e3,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		className: cn(className),
		children
	});
}
//#endregion
export { Reveal as t };
