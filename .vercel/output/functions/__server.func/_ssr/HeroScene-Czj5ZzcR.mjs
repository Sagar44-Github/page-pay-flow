import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Canvas, i as OrbitControls, n as Float, o as useFrame, r as MeshDistortMaterial, t as Stars } from "../_libs/@react-three/drei+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HeroScene-Czj5ZzcR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentOrb() {
	const mesh = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (mesh.current) {
			mesh.current.rotation.x = clock.getElapsedTime() * .15;
			mesh.current.rotation.y = clock.getElapsedTime() * .22;
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Float, {
		speed: 1.5,
		rotationIntensity: .4,
		floatIntensity: .8,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			ref: mesh,
			scale: 1.35,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("icosahedronGeometry", { args: [1, 1] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeshDistortMaterial, {
				color: "#44ffa4",
				emissive: "#9281f7",
				emissiveIntensity: .35,
				roughness: .25,
				metalness: .6,
				distort: .35,
				speed: 1.5,
				wireframe: true
			})]
		})
	});
}
function Scene() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .35 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				4,
				4,
				4
			],
			intensity: 1.2,
			color: "#44ffa4"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				-4,
				-2,
				2
			],
			intensity: .8,
			color: "#9281f7"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
			radius: 40,
			depth: 30,
			count: 1200,
			factor: 3,
			fade: true,
			speed: .5
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentOrb, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			enableZoom: false,
			enablePan: false,
			autoRotate: true,
			autoRotateSpeed: .6
		})
	] });
}
function HeroScene({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
			camera: {
				position: [
					0,
					0,
					4.5
				],
				fov: 45
			},
			dpr: [1, 1.5],
			gl: {
				antialias: true,
				alpha: true
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {})
			})
		})
	});
}
//#endregion
export { HeroScene };
