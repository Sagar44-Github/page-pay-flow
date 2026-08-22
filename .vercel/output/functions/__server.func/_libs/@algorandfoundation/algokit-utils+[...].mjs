import { a as __toCommonJS, i as __require, n as __esmMin, o as __toESM, r as __exportAll, t as __commonJSMin } from "../../_runtime.mjs";
import { createHmac } from "crypto";
import { Buffer as Buffer$1 } from "buffer";
import * as util from "util";
//#region node_modules/tweetnacl/nacl-fast.js
var require_nacl_fast = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(nacl) {
		"use strict";
		var gf = function(init) {
			var i, r = /* @__PURE__ */ new Float64Array(16);
			if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
			return r;
		};
		var randombytes = function() {
			throw new Error("no PRNG");
		};
		var _0 = /* @__PURE__ */ new Uint8Array(16);
		var _9 = /* @__PURE__ */ new Uint8Array(32);
		_9[0] = 9;
		var gf0 = gf(), gf1 = gf([1]), _121665 = gf([56129, 1]), D = gf([
			30883,
			4953,
			19914,
			30187,
			55467,
			16705,
			2637,
			112,
			59544,
			30585,
			16505,
			36039,
			65139,
			11119,
			27886,
			20995
		]), D2 = gf([
			61785,
			9906,
			39828,
			60374,
			45398,
			33411,
			5274,
			224,
			53552,
			61171,
			33010,
			6542,
			64743,
			22239,
			55772,
			9222
		]), X = gf([
			54554,
			36645,
			11616,
			51542,
			42930,
			38181,
			51040,
			26924,
			56412,
			64982,
			57905,
			49316,
			21502,
			52590,
			14035,
			8553
		]), Y = gf([
			26200,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214,
			26214
		]), I = gf([
			41136,
			18958,
			6951,
			50414,
			58488,
			44335,
			6150,
			12099,
			55207,
			15867,
			153,
			11085,
			57099,
			20417,
			9344,
			11139
		]);
		function ts64(x, i, h, l) {
			x[i] = h >> 24 & 255;
			x[i + 1] = h >> 16 & 255;
			x[i + 2] = h >> 8 & 255;
			x[i + 3] = h & 255;
			x[i + 4] = l >> 24 & 255;
			x[i + 5] = l >> 16 & 255;
			x[i + 6] = l >> 8 & 255;
			x[i + 7] = l & 255;
		}
		function vn(x, xi, y, yi, n) {
			var i, d = 0;
			for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
			return (1 & d - 1 >>> 8) - 1;
		}
		function crypto_verify_16(x, xi, y, yi) {
			return vn(x, xi, y, yi, 16);
		}
		function crypto_verify_32(x, xi, y, yi) {
			return vn(x, xi, y, yi, 32);
		}
		function core_salsa20(o, p, k, c) {
			var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
			var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
			for (var i = 0; i < 20; i += 2) {
				u = x0 + x12 | 0;
				x4 ^= u << 7 | u >>> 25;
				u = x4 + x0 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x4 | 0;
				x12 ^= u << 13 | u >>> 19;
				u = x12 + x8 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x1 | 0;
				x9 ^= u << 7 | u >>> 25;
				u = x9 + x5 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x9 | 0;
				x1 ^= u << 13 | u >>> 19;
				u = x1 + x13 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x6 | 0;
				x14 ^= u << 7 | u >>> 25;
				u = x14 + x10 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x14 | 0;
				x6 ^= u << 13 | u >>> 19;
				u = x6 + x2 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x11 | 0;
				x3 ^= u << 7 | u >>> 25;
				u = x3 + x15 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x3 | 0;
				x11 ^= u << 13 | u >>> 19;
				u = x11 + x7 | 0;
				x15 ^= u << 18 | u >>> 14;
				u = x0 + x3 | 0;
				x1 ^= u << 7 | u >>> 25;
				u = x1 + x0 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x1 | 0;
				x3 ^= u << 13 | u >>> 19;
				u = x3 + x2 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x4 | 0;
				x6 ^= u << 7 | u >>> 25;
				u = x6 + x5 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x6 | 0;
				x4 ^= u << 13 | u >>> 19;
				u = x4 + x7 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x9 | 0;
				x11 ^= u << 7 | u >>> 25;
				u = x11 + x10 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x11 | 0;
				x9 ^= u << 13 | u >>> 19;
				u = x9 + x8 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x14 | 0;
				x12 ^= u << 7 | u >>> 25;
				u = x12 + x15 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x12 | 0;
				x14 ^= u << 13 | u >>> 19;
				u = x14 + x13 | 0;
				x15 ^= u << 18 | u >>> 14;
			}
			x0 = x0 + j0 | 0;
			x1 = x1 + j1 | 0;
			x2 = x2 + j2 | 0;
			x3 = x3 + j3 | 0;
			x4 = x4 + j4 | 0;
			x5 = x5 + j5 | 0;
			x6 = x6 + j6 | 0;
			x7 = x7 + j7 | 0;
			x8 = x8 + j8 | 0;
			x9 = x9 + j9 | 0;
			x10 = x10 + j10 | 0;
			x11 = x11 + j11 | 0;
			x12 = x12 + j12 | 0;
			x13 = x13 + j13 | 0;
			x14 = x14 + j14 | 0;
			x15 = x15 + j15 | 0;
			o[0] = x0 >>> 0 & 255;
			o[1] = x0 >>> 8 & 255;
			o[2] = x0 >>> 16 & 255;
			o[3] = x0 >>> 24 & 255;
			o[4] = x1 >>> 0 & 255;
			o[5] = x1 >>> 8 & 255;
			o[6] = x1 >>> 16 & 255;
			o[7] = x1 >>> 24 & 255;
			o[8] = x2 >>> 0 & 255;
			o[9] = x2 >>> 8 & 255;
			o[10] = x2 >>> 16 & 255;
			o[11] = x2 >>> 24 & 255;
			o[12] = x3 >>> 0 & 255;
			o[13] = x3 >>> 8 & 255;
			o[14] = x3 >>> 16 & 255;
			o[15] = x3 >>> 24 & 255;
			o[16] = x4 >>> 0 & 255;
			o[17] = x4 >>> 8 & 255;
			o[18] = x4 >>> 16 & 255;
			o[19] = x4 >>> 24 & 255;
			o[20] = x5 >>> 0 & 255;
			o[21] = x5 >>> 8 & 255;
			o[22] = x5 >>> 16 & 255;
			o[23] = x5 >>> 24 & 255;
			o[24] = x6 >>> 0 & 255;
			o[25] = x6 >>> 8 & 255;
			o[26] = x6 >>> 16 & 255;
			o[27] = x6 >>> 24 & 255;
			o[28] = x7 >>> 0 & 255;
			o[29] = x7 >>> 8 & 255;
			o[30] = x7 >>> 16 & 255;
			o[31] = x7 >>> 24 & 255;
			o[32] = x8 >>> 0 & 255;
			o[33] = x8 >>> 8 & 255;
			o[34] = x8 >>> 16 & 255;
			o[35] = x8 >>> 24 & 255;
			o[36] = x9 >>> 0 & 255;
			o[37] = x9 >>> 8 & 255;
			o[38] = x9 >>> 16 & 255;
			o[39] = x9 >>> 24 & 255;
			o[40] = x10 >>> 0 & 255;
			o[41] = x10 >>> 8 & 255;
			o[42] = x10 >>> 16 & 255;
			o[43] = x10 >>> 24 & 255;
			o[44] = x11 >>> 0 & 255;
			o[45] = x11 >>> 8 & 255;
			o[46] = x11 >>> 16 & 255;
			o[47] = x11 >>> 24 & 255;
			o[48] = x12 >>> 0 & 255;
			o[49] = x12 >>> 8 & 255;
			o[50] = x12 >>> 16 & 255;
			o[51] = x12 >>> 24 & 255;
			o[52] = x13 >>> 0 & 255;
			o[53] = x13 >>> 8 & 255;
			o[54] = x13 >>> 16 & 255;
			o[55] = x13 >>> 24 & 255;
			o[56] = x14 >>> 0 & 255;
			o[57] = x14 >>> 8 & 255;
			o[58] = x14 >>> 16 & 255;
			o[59] = x14 >>> 24 & 255;
			o[60] = x15 >>> 0 & 255;
			o[61] = x15 >>> 8 & 255;
			o[62] = x15 >>> 16 & 255;
			o[63] = x15 >>> 24 & 255;
		}
		function core_hsalsa20(o, p, k, c) {
			var j0 = c[0] & 255 | (c[1] & 255) << 8 | (c[2] & 255) << 16 | (c[3] & 255) << 24, j1 = k[0] & 255 | (k[1] & 255) << 8 | (k[2] & 255) << 16 | (k[3] & 255) << 24, j2 = k[4] & 255 | (k[5] & 255) << 8 | (k[6] & 255) << 16 | (k[7] & 255) << 24, j3 = k[8] & 255 | (k[9] & 255) << 8 | (k[10] & 255) << 16 | (k[11] & 255) << 24, j4 = k[12] & 255 | (k[13] & 255) << 8 | (k[14] & 255) << 16 | (k[15] & 255) << 24, j5 = c[4] & 255 | (c[5] & 255) << 8 | (c[6] & 255) << 16 | (c[7] & 255) << 24, j6 = p[0] & 255 | (p[1] & 255) << 8 | (p[2] & 255) << 16 | (p[3] & 255) << 24, j7 = p[4] & 255 | (p[5] & 255) << 8 | (p[6] & 255) << 16 | (p[7] & 255) << 24, j8 = p[8] & 255 | (p[9] & 255) << 8 | (p[10] & 255) << 16 | (p[11] & 255) << 24, j9 = p[12] & 255 | (p[13] & 255) << 8 | (p[14] & 255) << 16 | (p[15] & 255) << 24, j10 = c[8] & 255 | (c[9] & 255) << 8 | (c[10] & 255) << 16 | (c[11] & 255) << 24, j11 = k[16] & 255 | (k[17] & 255) << 8 | (k[18] & 255) << 16 | (k[19] & 255) << 24, j12 = k[20] & 255 | (k[21] & 255) << 8 | (k[22] & 255) << 16 | (k[23] & 255) << 24, j13 = k[24] & 255 | (k[25] & 255) << 8 | (k[26] & 255) << 16 | (k[27] & 255) << 24, j14 = k[28] & 255 | (k[29] & 255) << 8 | (k[30] & 255) << 16 | (k[31] & 255) << 24, j15 = c[12] & 255 | (c[13] & 255) << 8 | (c[14] & 255) << 16 | (c[15] & 255) << 24;
			var x0 = j0, x1 = j1, x2 = j2, x3 = j3, x4 = j4, x5 = j5, x6 = j6, x7 = j7, x8 = j8, x9 = j9, x10 = j10, x11 = j11, x12 = j12, x13 = j13, x14 = j14, x15 = j15, u;
			for (var i = 0; i < 20; i += 2) {
				u = x0 + x12 | 0;
				x4 ^= u << 7 | u >>> 25;
				u = x4 + x0 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x4 | 0;
				x12 ^= u << 13 | u >>> 19;
				u = x12 + x8 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x1 | 0;
				x9 ^= u << 7 | u >>> 25;
				u = x9 + x5 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x9 | 0;
				x1 ^= u << 13 | u >>> 19;
				u = x1 + x13 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x6 | 0;
				x14 ^= u << 7 | u >>> 25;
				u = x14 + x10 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x14 | 0;
				x6 ^= u << 13 | u >>> 19;
				u = x6 + x2 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x11 | 0;
				x3 ^= u << 7 | u >>> 25;
				u = x3 + x15 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x3 | 0;
				x11 ^= u << 13 | u >>> 19;
				u = x11 + x7 | 0;
				x15 ^= u << 18 | u >>> 14;
				u = x0 + x3 | 0;
				x1 ^= u << 7 | u >>> 25;
				u = x1 + x0 | 0;
				x2 ^= u << 9 | u >>> 23;
				u = x2 + x1 | 0;
				x3 ^= u << 13 | u >>> 19;
				u = x3 + x2 | 0;
				x0 ^= u << 18 | u >>> 14;
				u = x5 + x4 | 0;
				x6 ^= u << 7 | u >>> 25;
				u = x6 + x5 | 0;
				x7 ^= u << 9 | u >>> 23;
				u = x7 + x6 | 0;
				x4 ^= u << 13 | u >>> 19;
				u = x4 + x7 | 0;
				x5 ^= u << 18 | u >>> 14;
				u = x10 + x9 | 0;
				x11 ^= u << 7 | u >>> 25;
				u = x11 + x10 | 0;
				x8 ^= u << 9 | u >>> 23;
				u = x8 + x11 | 0;
				x9 ^= u << 13 | u >>> 19;
				u = x9 + x8 | 0;
				x10 ^= u << 18 | u >>> 14;
				u = x15 + x14 | 0;
				x12 ^= u << 7 | u >>> 25;
				u = x12 + x15 | 0;
				x13 ^= u << 9 | u >>> 23;
				u = x13 + x12 | 0;
				x14 ^= u << 13 | u >>> 19;
				u = x14 + x13 | 0;
				x15 ^= u << 18 | u >>> 14;
			}
			o[0] = x0 >>> 0 & 255;
			o[1] = x0 >>> 8 & 255;
			o[2] = x0 >>> 16 & 255;
			o[3] = x0 >>> 24 & 255;
			o[4] = x5 >>> 0 & 255;
			o[5] = x5 >>> 8 & 255;
			o[6] = x5 >>> 16 & 255;
			o[7] = x5 >>> 24 & 255;
			o[8] = x10 >>> 0 & 255;
			o[9] = x10 >>> 8 & 255;
			o[10] = x10 >>> 16 & 255;
			o[11] = x10 >>> 24 & 255;
			o[12] = x15 >>> 0 & 255;
			o[13] = x15 >>> 8 & 255;
			o[14] = x15 >>> 16 & 255;
			o[15] = x15 >>> 24 & 255;
			o[16] = x6 >>> 0 & 255;
			o[17] = x6 >>> 8 & 255;
			o[18] = x6 >>> 16 & 255;
			o[19] = x6 >>> 24 & 255;
			o[20] = x7 >>> 0 & 255;
			o[21] = x7 >>> 8 & 255;
			o[22] = x7 >>> 16 & 255;
			o[23] = x7 >>> 24 & 255;
			o[24] = x8 >>> 0 & 255;
			o[25] = x8 >>> 8 & 255;
			o[26] = x8 >>> 16 & 255;
			o[27] = x8 >>> 24 & 255;
			o[28] = x9 >>> 0 & 255;
			o[29] = x9 >>> 8 & 255;
			o[30] = x9 >>> 16 & 255;
			o[31] = x9 >>> 24 & 255;
		}
		function crypto_core_salsa20(out, inp, k, c) {
			core_salsa20(out, inp, k, c);
		}
		function crypto_core_hsalsa20(out, inp, k, c) {
			core_hsalsa20(out, inp, k, c);
		}
		var sigma = new Uint8Array([
			101,
			120,
			112,
			97,
			110,
			100,
			32,
			51,
			50,
			45,
			98,
			121,
			116,
			101,
			32,
			107
		]);
		function crypto_stream_salsa20_xor(c, cpos, m, mpos, b, n, k) {
			var z = /* @__PURE__ */ new Uint8Array(16), x = /* @__PURE__ */ new Uint8Array(64);
			var u, i;
			for (i = 0; i < 16; i++) z[i] = 0;
			for (i = 0; i < 8; i++) z[i] = n[i];
			while (b >= 64) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < 64; i++) c[cpos + i] = m[mpos + i] ^ x[i];
				u = 1;
				for (i = 8; i < 16; i++) {
					u = u + (z[i] & 255) | 0;
					z[i] = u & 255;
					u >>>= 8;
				}
				b -= 64;
				cpos += 64;
				mpos += 64;
			}
			if (b > 0) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < b; i++) c[cpos + i] = m[mpos + i] ^ x[i];
			}
			return 0;
		}
		function crypto_stream_salsa20(c, cpos, b, n, k) {
			var z = /* @__PURE__ */ new Uint8Array(16), x = /* @__PURE__ */ new Uint8Array(64);
			var u, i;
			for (i = 0; i < 16; i++) z[i] = 0;
			for (i = 0; i < 8; i++) z[i] = n[i];
			while (b >= 64) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < 64; i++) c[cpos + i] = x[i];
				u = 1;
				for (i = 8; i < 16; i++) {
					u = u + (z[i] & 255) | 0;
					z[i] = u & 255;
					u >>>= 8;
				}
				b -= 64;
				cpos += 64;
			}
			if (b > 0) {
				crypto_core_salsa20(x, z, k, sigma);
				for (i = 0; i < b; i++) c[cpos + i] = x[i];
			}
			return 0;
		}
		function crypto_stream(c, cpos, d, n, k) {
			var s = /* @__PURE__ */ new Uint8Array(32);
			crypto_core_hsalsa20(s, n, k, sigma);
			var sn = /* @__PURE__ */ new Uint8Array(8);
			for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
			return crypto_stream_salsa20(c, cpos, d, sn, s);
		}
		function crypto_stream_xor(c, cpos, m, mpos, d, n, k) {
			var s = /* @__PURE__ */ new Uint8Array(32);
			crypto_core_hsalsa20(s, n, k, sigma);
			var sn = /* @__PURE__ */ new Uint8Array(8);
			for (var i = 0; i < 8; i++) sn[i] = n[i + 16];
			return crypto_stream_salsa20_xor(c, cpos, m, mpos, d, sn, s);
		}
		var poly1305 = function(key) {
			this.buffer = /* @__PURE__ */ new Uint8Array(16);
			this.r = /* @__PURE__ */ new Uint16Array(10);
			this.h = /* @__PURE__ */ new Uint16Array(10);
			this.pad = /* @__PURE__ */ new Uint16Array(8);
			this.leftover = 0;
			this.fin = 0;
			var t0 = key[0] & 255 | (key[1] & 255) << 8, t1, t2, t3, t4, t5, t6, t7;
			this.r[0] = t0 & 8191;
			t1 = key[2] & 255 | (key[3] & 255) << 8;
			this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
			t2 = key[4] & 255 | (key[5] & 255) << 8;
			this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
			t3 = key[6] & 255 | (key[7] & 255) << 8;
			this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
			t4 = key[8] & 255 | (key[9] & 255) << 8;
			this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
			this.r[5] = t4 >>> 1 & 8190;
			t5 = key[10] & 255 | (key[11] & 255) << 8;
			this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
			t6 = key[12] & 255 | (key[13] & 255) << 8;
			this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
			t7 = key[14] & 255 | (key[15] & 255) << 8;
			this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
			this.r[9] = t7 >>> 5 & 127;
			this.pad[0] = key[16] & 255 | (key[17] & 255) << 8;
			this.pad[1] = key[18] & 255 | (key[19] & 255) << 8;
			this.pad[2] = key[20] & 255 | (key[21] & 255) << 8;
			this.pad[3] = key[22] & 255 | (key[23] & 255) << 8;
			this.pad[4] = key[24] & 255 | (key[25] & 255) << 8;
			this.pad[5] = key[26] & 255 | (key[27] & 255) << 8;
			this.pad[6] = key[28] & 255 | (key[29] & 255) << 8;
			this.pad[7] = key[30] & 255 | (key[31] & 255) << 8;
		};
		poly1305.prototype.blocks = function(m, mpos, bytes) {
			var hibit = this.fin ? 0 : 2048;
			var t0, t1, t2, t3, t4, t5, t6, t7, c;
			var d0, d1, d2, d3, d4, d5, d6, d7, d8, d9;
			var h0 = this.h[0], h1 = this.h[1], h2 = this.h[2], h3 = this.h[3], h4 = this.h[4], h5 = this.h[5], h6 = this.h[6], h7 = this.h[7], h8 = this.h[8], h9 = this.h[9];
			var r0 = this.r[0], r1 = this.r[1], r2 = this.r[2], r3 = this.r[3], r4 = this.r[4], r5 = this.r[5], r6 = this.r[6], r7 = this.r[7], r8 = this.r[8], r9 = this.r[9];
			while (bytes >= 16) {
				t0 = m[mpos + 0] & 255 | (m[mpos + 1] & 255) << 8;
				h0 += t0 & 8191;
				t1 = m[mpos + 2] & 255 | (m[mpos + 3] & 255) << 8;
				h1 += (t0 >>> 13 | t1 << 3) & 8191;
				t2 = m[mpos + 4] & 255 | (m[mpos + 5] & 255) << 8;
				h2 += (t1 >>> 10 | t2 << 6) & 8191;
				t3 = m[mpos + 6] & 255 | (m[mpos + 7] & 255) << 8;
				h3 += (t2 >>> 7 | t3 << 9) & 8191;
				t4 = m[mpos + 8] & 255 | (m[mpos + 9] & 255) << 8;
				h4 += (t3 >>> 4 | t4 << 12) & 8191;
				h5 += t4 >>> 1 & 8191;
				t5 = m[mpos + 10] & 255 | (m[mpos + 11] & 255) << 8;
				h6 += (t4 >>> 14 | t5 << 2) & 8191;
				t6 = m[mpos + 12] & 255 | (m[mpos + 13] & 255) << 8;
				h7 += (t5 >>> 11 | t6 << 5) & 8191;
				t7 = m[mpos + 14] & 255 | (m[mpos + 15] & 255) << 8;
				h8 += (t6 >>> 8 | t7 << 8) & 8191;
				h9 += t7 >>> 5 | hibit;
				c = 0;
				d0 = c;
				d0 += h0 * r0;
				d0 += h1 * (5 * r9);
				d0 += h2 * (5 * r8);
				d0 += h3 * (5 * r7);
				d0 += h4 * (5 * r6);
				c = d0 >>> 13;
				d0 &= 8191;
				d0 += h5 * (5 * r5);
				d0 += h6 * (5 * r4);
				d0 += h7 * (5 * r3);
				d0 += h8 * (5 * r2);
				d0 += h9 * (5 * r1);
				c += d0 >>> 13;
				d0 &= 8191;
				d1 = c;
				d1 += h0 * r1;
				d1 += h1 * r0;
				d1 += h2 * (5 * r9);
				d1 += h3 * (5 * r8);
				d1 += h4 * (5 * r7);
				c = d1 >>> 13;
				d1 &= 8191;
				d1 += h5 * (5 * r6);
				d1 += h6 * (5 * r5);
				d1 += h7 * (5 * r4);
				d1 += h8 * (5 * r3);
				d1 += h9 * (5 * r2);
				c += d1 >>> 13;
				d1 &= 8191;
				d2 = c;
				d2 += h0 * r2;
				d2 += h1 * r1;
				d2 += h2 * r0;
				d2 += h3 * (5 * r9);
				d2 += h4 * (5 * r8);
				c = d2 >>> 13;
				d2 &= 8191;
				d2 += h5 * (5 * r7);
				d2 += h6 * (5 * r6);
				d2 += h7 * (5 * r5);
				d2 += h8 * (5 * r4);
				d2 += h9 * (5 * r3);
				c += d2 >>> 13;
				d2 &= 8191;
				d3 = c;
				d3 += h0 * r3;
				d3 += h1 * r2;
				d3 += h2 * r1;
				d3 += h3 * r0;
				d3 += h4 * (5 * r9);
				c = d3 >>> 13;
				d3 &= 8191;
				d3 += h5 * (5 * r8);
				d3 += h6 * (5 * r7);
				d3 += h7 * (5 * r6);
				d3 += h8 * (5 * r5);
				d3 += h9 * (5 * r4);
				c += d3 >>> 13;
				d3 &= 8191;
				d4 = c;
				d4 += h0 * r4;
				d4 += h1 * r3;
				d4 += h2 * r2;
				d4 += h3 * r1;
				d4 += h4 * r0;
				c = d4 >>> 13;
				d4 &= 8191;
				d4 += h5 * (5 * r9);
				d4 += h6 * (5 * r8);
				d4 += h7 * (5 * r7);
				d4 += h8 * (5 * r6);
				d4 += h9 * (5 * r5);
				c += d4 >>> 13;
				d4 &= 8191;
				d5 = c;
				d5 += h0 * r5;
				d5 += h1 * r4;
				d5 += h2 * r3;
				d5 += h3 * r2;
				d5 += h4 * r1;
				c = d5 >>> 13;
				d5 &= 8191;
				d5 += h5 * r0;
				d5 += h6 * (5 * r9);
				d5 += h7 * (5 * r8);
				d5 += h8 * (5 * r7);
				d5 += h9 * (5 * r6);
				c += d5 >>> 13;
				d5 &= 8191;
				d6 = c;
				d6 += h0 * r6;
				d6 += h1 * r5;
				d6 += h2 * r4;
				d6 += h3 * r3;
				d6 += h4 * r2;
				c = d6 >>> 13;
				d6 &= 8191;
				d6 += h5 * r1;
				d6 += h6 * r0;
				d6 += h7 * (5 * r9);
				d6 += h8 * (5 * r8);
				d6 += h9 * (5 * r7);
				c += d6 >>> 13;
				d6 &= 8191;
				d7 = c;
				d7 += h0 * r7;
				d7 += h1 * r6;
				d7 += h2 * r5;
				d7 += h3 * r4;
				d7 += h4 * r3;
				c = d7 >>> 13;
				d7 &= 8191;
				d7 += h5 * r2;
				d7 += h6 * r1;
				d7 += h7 * r0;
				d7 += h8 * (5 * r9);
				d7 += h9 * (5 * r8);
				c += d7 >>> 13;
				d7 &= 8191;
				d8 = c;
				d8 += h0 * r8;
				d8 += h1 * r7;
				d8 += h2 * r6;
				d8 += h3 * r5;
				d8 += h4 * r4;
				c = d8 >>> 13;
				d8 &= 8191;
				d8 += h5 * r3;
				d8 += h6 * r2;
				d8 += h7 * r1;
				d8 += h8 * r0;
				d8 += h9 * (5 * r9);
				c += d8 >>> 13;
				d8 &= 8191;
				d9 = c;
				d9 += h0 * r9;
				d9 += h1 * r8;
				d9 += h2 * r7;
				d9 += h3 * r6;
				d9 += h4 * r5;
				c = d9 >>> 13;
				d9 &= 8191;
				d9 += h5 * r4;
				d9 += h6 * r3;
				d9 += h7 * r2;
				d9 += h8 * r1;
				d9 += h9 * r0;
				c += d9 >>> 13;
				d9 &= 8191;
				c = (c << 2) + c | 0;
				c = c + d0 | 0;
				d0 = c & 8191;
				c = c >>> 13;
				d1 += c;
				h0 = d0;
				h1 = d1;
				h2 = d2;
				h3 = d3;
				h4 = d4;
				h5 = d5;
				h6 = d6;
				h7 = d7;
				h8 = d8;
				h9 = d9;
				mpos += 16;
				bytes -= 16;
			}
			this.h[0] = h0;
			this.h[1] = h1;
			this.h[2] = h2;
			this.h[3] = h3;
			this.h[4] = h4;
			this.h[5] = h5;
			this.h[6] = h6;
			this.h[7] = h7;
			this.h[8] = h8;
			this.h[9] = h9;
		};
		poly1305.prototype.finish = function(mac, macpos) {
			var g = /* @__PURE__ */ new Uint16Array(10);
			var c, mask, f, i;
			if (this.leftover) {
				i = this.leftover;
				this.buffer[i++] = 1;
				for (; i < 16; i++) this.buffer[i] = 0;
				this.fin = 1;
				this.blocks(this.buffer, 0, 16);
			}
			c = this.h[1] >>> 13;
			this.h[1] &= 8191;
			for (i = 2; i < 10; i++) {
				this.h[i] += c;
				c = this.h[i] >>> 13;
				this.h[i] &= 8191;
			}
			this.h[0] += c * 5;
			c = this.h[0] >>> 13;
			this.h[0] &= 8191;
			this.h[1] += c;
			c = this.h[1] >>> 13;
			this.h[1] &= 8191;
			this.h[2] += c;
			g[0] = this.h[0] + 5;
			c = g[0] >>> 13;
			g[0] &= 8191;
			for (i = 1; i < 10; i++) {
				g[i] = this.h[i] + c;
				c = g[i] >>> 13;
				g[i] &= 8191;
			}
			g[9] -= 8192;
			mask = (c ^ 1) - 1;
			for (i = 0; i < 10; i++) g[i] &= mask;
			mask = ~mask;
			for (i = 0; i < 10; i++) this.h[i] = this.h[i] & mask | g[i];
			this.h[0] = (this.h[0] | this.h[1] << 13) & 65535;
			this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535;
			this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535;
			this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535;
			this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535;
			this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535;
			this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535;
			this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535;
			f = this.h[0] + this.pad[0];
			this.h[0] = f & 65535;
			for (i = 1; i < 8; i++) {
				f = (this.h[i] + this.pad[i] | 0) + (f >>> 16) | 0;
				this.h[i] = f & 65535;
			}
			mac[macpos + 0] = this.h[0] >>> 0 & 255;
			mac[macpos + 1] = this.h[0] >>> 8 & 255;
			mac[macpos + 2] = this.h[1] >>> 0 & 255;
			mac[macpos + 3] = this.h[1] >>> 8 & 255;
			mac[macpos + 4] = this.h[2] >>> 0 & 255;
			mac[macpos + 5] = this.h[2] >>> 8 & 255;
			mac[macpos + 6] = this.h[3] >>> 0 & 255;
			mac[macpos + 7] = this.h[3] >>> 8 & 255;
			mac[macpos + 8] = this.h[4] >>> 0 & 255;
			mac[macpos + 9] = this.h[4] >>> 8 & 255;
			mac[macpos + 10] = this.h[5] >>> 0 & 255;
			mac[macpos + 11] = this.h[5] >>> 8 & 255;
			mac[macpos + 12] = this.h[6] >>> 0 & 255;
			mac[macpos + 13] = this.h[6] >>> 8 & 255;
			mac[macpos + 14] = this.h[7] >>> 0 & 255;
			mac[macpos + 15] = this.h[7] >>> 8 & 255;
		};
		poly1305.prototype.update = function(m, mpos, bytes) {
			var i, want;
			if (this.leftover) {
				want = 16 - this.leftover;
				if (want > bytes) want = bytes;
				for (i = 0; i < want; i++) this.buffer[this.leftover + i] = m[mpos + i];
				bytes -= want;
				mpos += want;
				this.leftover += want;
				if (this.leftover < 16) return;
				this.blocks(this.buffer, 0, 16);
				this.leftover = 0;
			}
			if (bytes >= 16) {
				want = bytes - bytes % 16;
				this.blocks(m, mpos, want);
				mpos += want;
				bytes -= want;
			}
			if (bytes) {
				for (i = 0; i < bytes; i++) this.buffer[this.leftover + i] = m[mpos + i];
				this.leftover += bytes;
			}
		};
		function crypto_onetimeauth(out, outpos, m, mpos, n, k) {
			var s = new poly1305(k);
			s.update(m, mpos, n);
			s.finish(out, outpos);
			return 0;
		}
		function crypto_onetimeauth_verify(h, hpos, m, mpos, n, k) {
			var x = /* @__PURE__ */ new Uint8Array(16);
			crypto_onetimeauth(x, 0, m, mpos, n, k);
			return crypto_verify_16(h, hpos, x, 0);
		}
		function crypto_secretbox(c, m, d, n, k) {
			var i;
			if (d < 32) return -1;
			crypto_stream_xor(c, 0, m, 0, d, n, k);
			crypto_onetimeauth(c, 16, c, 32, d - 32, c);
			for (i = 0; i < 16; i++) c[i] = 0;
			return 0;
		}
		function crypto_secretbox_open(m, c, d, n, k) {
			var i;
			var x = /* @__PURE__ */ new Uint8Array(32);
			if (d < 32) return -1;
			crypto_stream(x, 0, 32, n, k);
			if (crypto_onetimeauth_verify(c, 16, c, 32, d - 32, x) !== 0) return -1;
			crypto_stream_xor(m, 0, c, 0, d, n, k);
			for (i = 0; i < 32; i++) m[i] = 0;
			return 0;
		}
		function set25519(r, a) {
			var i;
			for (i = 0; i < 16; i++) r[i] = a[i] | 0;
		}
		function car25519(o) {
			var i, v, c = 1;
			for (i = 0; i < 16; i++) {
				v = o[i] + c + 65535;
				c = Math.floor(v / 65536);
				o[i] = v - c * 65536;
			}
			o[0] += c - 1 + 37 * (c - 1);
		}
		function sel25519(p, q, b) {
			var t, c = ~(b - 1);
			for (var i = 0; i < 16; i++) {
				t = c & (p[i] ^ q[i]);
				p[i] ^= t;
				q[i] ^= t;
			}
		}
		function pack25519(o, n) {
			var i, j, b;
			var m = gf(), t = gf();
			for (i = 0; i < 16; i++) t[i] = n[i];
			car25519(t);
			car25519(t);
			car25519(t);
			for (j = 0; j < 2; j++) {
				m[0] = t[0] - 65517;
				for (i = 1; i < 15; i++) {
					m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
					m[i - 1] &= 65535;
				}
				m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
				b = m[15] >> 16 & 1;
				m[14] &= 65535;
				sel25519(t, m, 1 - b);
			}
			for (i = 0; i < 16; i++) {
				o[2 * i] = t[i] & 255;
				o[2 * i + 1] = t[i] >> 8;
			}
		}
		function neq25519(a, b) {
			var c = /* @__PURE__ */ new Uint8Array(32), d = /* @__PURE__ */ new Uint8Array(32);
			pack25519(c, a);
			pack25519(d, b);
			return crypto_verify_32(c, 0, d, 0);
		}
		function par25519(a) {
			var d = /* @__PURE__ */ new Uint8Array(32);
			pack25519(d, a);
			return d[0] & 1;
		}
		function unpack25519(o, n) {
			var i;
			for (i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
			o[15] &= 32767;
		}
		function A(o, a, b) {
			for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
		}
		function Z(o, a, b) {
			for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
		}
		function M(o, a, b) {
			var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
			v = a[0];
			t0 += v * b0;
			t1 += v * b1;
			t2 += v * b2;
			t3 += v * b3;
			t4 += v * b4;
			t5 += v * b5;
			t6 += v * b6;
			t7 += v * b7;
			t8 += v * b8;
			t9 += v * b9;
			t10 += v * b10;
			t11 += v * b11;
			t12 += v * b12;
			t13 += v * b13;
			t14 += v * b14;
			t15 += v * b15;
			v = a[1];
			t1 += v * b0;
			t2 += v * b1;
			t3 += v * b2;
			t4 += v * b3;
			t5 += v * b4;
			t6 += v * b5;
			t7 += v * b6;
			t8 += v * b7;
			t9 += v * b8;
			t10 += v * b9;
			t11 += v * b10;
			t12 += v * b11;
			t13 += v * b12;
			t14 += v * b13;
			t15 += v * b14;
			t16 += v * b15;
			v = a[2];
			t2 += v * b0;
			t3 += v * b1;
			t4 += v * b2;
			t5 += v * b3;
			t6 += v * b4;
			t7 += v * b5;
			t8 += v * b6;
			t9 += v * b7;
			t10 += v * b8;
			t11 += v * b9;
			t12 += v * b10;
			t13 += v * b11;
			t14 += v * b12;
			t15 += v * b13;
			t16 += v * b14;
			t17 += v * b15;
			v = a[3];
			t3 += v * b0;
			t4 += v * b1;
			t5 += v * b2;
			t6 += v * b3;
			t7 += v * b4;
			t8 += v * b5;
			t9 += v * b6;
			t10 += v * b7;
			t11 += v * b8;
			t12 += v * b9;
			t13 += v * b10;
			t14 += v * b11;
			t15 += v * b12;
			t16 += v * b13;
			t17 += v * b14;
			t18 += v * b15;
			v = a[4];
			t4 += v * b0;
			t5 += v * b1;
			t6 += v * b2;
			t7 += v * b3;
			t8 += v * b4;
			t9 += v * b5;
			t10 += v * b6;
			t11 += v * b7;
			t12 += v * b8;
			t13 += v * b9;
			t14 += v * b10;
			t15 += v * b11;
			t16 += v * b12;
			t17 += v * b13;
			t18 += v * b14;
			t19 += v * b15;
			v = a[5];
			t5 += v * b0;
			t6 += v * b1;
			t7 += v * b2;
			t8 += v * b3;
			t9 += v * b4;
			t10 += v * b5;
			t11 += v * b6;
			t12 += v * b7;
			t13 += v * b8;
			t14 += v * b9;
			t15 += v * b10;
			t16 += v * b11;
			t17 += v * b12;
			t18 += v * b13;
			t19 += v * b14;
			t20 += v * b15;
			v = a[6];
			t6 += v * b0;
			t7 += v * b1;
			t8 += v * b2;
			t9 += v * b3;
			t10 += v * b4;
			t11 += v * b5;
			t12 += v * b6;
			t13 += v * b7;
			t14 += v * b8;
			t15 += v * b9;
			t16 += v * b10;
			t17 += v * b11;
			t18 += v * b12;
			t19 += v * b13;
			t20 += v * b14;
			t21 += v * b15;
			v = a[7];
			t7 += v * b0;
			t8 += v * b1;
			t9 += v * b2;
			t10 += v * b3;
			t11 += v * b4;
			t12 += v * b5;
			t13 += v * b6;
			t14 += v * b7;
			t15 += v * b8;
			t16 += v * b9;
			t17 += v * b10;
			t18 += v * b11;
			t19 += v * b12;
			t20 += v * b13;
			t21 += v * b14;
			t22 += v * b15;
			v = a[8];
			t8 += v * b0;
			t9 += v * b1;
			t10 += v * b2;
			t11 += v * b3;
			t12 += v * b4;
			t13 += v * b5;
			t14 += v * b6;
			t15 += v * b7;
			t16 += v * b8;
			t17 += v * b9;
			t18 += v * b10;
			t19 += v * b11;
			t20 += v * b12;
			t21 += v * b13;
			t22 += v * b14;
			t23 += v * b15;
			v = a[9];
			t9 += v * b0;
			t10 += v * b1;
			t11 += v * b2;
			t12 += v * b3;
			t13 += v * b4;
			t14 += v * b5;
			t15 += v * b6;
			t16 += v * b7;
			t17 += v * b8;
			t18 += v * b9;
			t19 += v * b10;
			t20 += v * b11;
			t21 += v * b12;
			t22 += v * b13;
			t23 += v * b14;
			t24 += v * b15;
			v = a[10];
			t10 += v * b0;
			t11 += v * b1;
			t12 += v * b2;
			t13 += v * b3;
			t14 += v * b4;
			t15 += v * b5;
			t16 += v * b6;
			t17 += v * b7;
			t18 += v * b8;
			t19 += v * b9;
			t20 += v * b10;
			t21 += v * b11;
			t22 += v * b12;
			t23 += v * b13;
			t24 += v * b14;
			t25 += v * b15;
			v = a[11];
			t11 += v * b0;
			t12 += v * b1;
			t13 += v * b2;
			t14 += v * b3;
			t15 += v * b4;
			t16 += v * b5;
			t17 += v * b6;
			t18 += v * b7;
			t19 += v * b8;
			t20 += v * b9;
			t21 += v * b10;
			t22 += v * b11;
			t23 += v * b12;
			t24 += v * b13;
			t25 += v * b14;
			t26 += v * b15;
			v = a[12];
			t12 += v * b0;
			t13 += v * b1;
			t14 += v * b2;
			t15 += v * b3;
			t16 += v * b4;
			t17 += v * b5;
			t18 += v * b6;
			t19 += v * b7;
			t20 += v * b8;
			t21 += v * b9;
			t22 += v * b10;
			t23 += v * b11;
			t24 += v * b12;
			t25 += v * b13;
			t26 += v * b14;
			t27 += v * b15;
			v = a[13];
			t13 += v * b0;
			t14 += v * b1;
			t15 += v * b2;
			t16 += v * b3;
			t17 += v * b4;
			t18 += v * b5;
			t19 += v * b6;
			t20 += v * b7;
			t21 += v * b8;
			t22 += v * b9;
			t23 += v * b10;
			t24 += v * b11;
			t25 += v * b12;
			t26 += v * b13;
			t27 += v * b14;
			t28 += v * b15;
			v = a[14];
			t14 += v * b0;
			t15 += v * b1;
			t16 += v * b2;
			t17 += v * b3;
			t18 += v * b4;
			t19 += v * b5;
			t20 += v * b6;
			t21 += v * b7;
			t22 += v * b8;
			t23 += v * b9;
			t24 += v * b10;
			t25 += v * b11;
			t26 += v * b12;
			t27 += v * b13;
			t28 += v * b14;
			t29 += v * b15;
			v = a[15];
			t15 += v * b0;
			t16 += v * b1;
			t17 += v * b2;
			t18 += v * b3;
			t19 += v * b4;
			t20 += v * b5;
			t21 += v * b6;
			t22 += v * b7;
			t23 += v * b8;
			t24 += v * b9;
			t25 += v * b10;
			t26 += v * b11;
			t27 += v * b12;
			t28 += v * b13;
			t29 += v * b14;
			t30 += v * b15;
			t0 += 38 * t16;
			t1 += 38 * t17;
			t2 += 38 * t18;
			t3 += 38 * t19;
			t4 += 38 * t20;
			t5 += 38 * t21;
			t6 += 38 * t22;
			t7 += 38 * t23;
			t8 += 38 * t24;
			t9 += 38 * t25;
			t10 += 38 * t26;
			t11 += 38 * t27;
			t12 += 38 * t28;
			t13 += 38 * t29;
			t14 += 38 * t30;
			c = 1;
			v = t0 + c + 65535;
			c = Math.floor(v / 65536);
			t0 = v - c * 65536;
			v = t1 + c + 65535;
			c = Math.floor(v / 65536);
			t1 = v - c * 65536;
			v = t2 + c + 65535;
			c = Math.floor(v / 65536);
			t2 = v - c * 65536;
			v = t3 + c + 65535;
			c = Math.floor(v / 65536);
			t3 = v - c * 65536;
			v = t4 + c + 65535;
			c = Math.floor(v / 65536);
			t4 = v - c * 65536;
			v = t5 + c + 65535;
			c = Math.floor(v / 65536);
			t5 = v - c * 65536;
			v = t6 + c + 65535;
			c = Math.floor(v / 65536);
			t6 = v - c * 65536;
			v = t7 + c + 65535;
			c = Math.floor(v / 65536);
			t7 = v - c * 65536;
			v = t8 + c + 65535;
			c = Math.floor(v / 65536);
			t8 = v - c * 65536;
			v = t9 + c + 65535;
			c = Math.floor(v / 65536);
			t9 = v - c * 65536;
			v = t10 + c + 65535;
			c = Math.floor(v / 65536);
			t10 = v - c * 65536;
			v = t11 + c + 65535;
			c = Math.floor(v / 65536);
			t11 = v - c * 65536;
			v = t12 + c + 65535;
			c = Math.floor(v / 65536);
			t12 = v - c * 65536;
			v = t13 + c + 65535;
			c = Math.floor(v / 65536);
			t13 = v - c * 65536;
			v = t14 + c + 65535;
			c = Math.floor(v / 65536);
			t14 = v - c * 65536;
			v = t15 + c + 65535;
			c = Math.floor(v / 65536);
			t15 = v - c * 65536;
			t0 += c - 1 + 37 * (c - 1);
			c = 1;
			v = t0 + c + 65535;
			c = Math.floor(v / 65536);
			t0 = v - c * 65536;
			v = t1 + c + 65535;
			c = Math.floor(v / 65536);
			t1 = v - c * 65536;
			v = t2 + c + 65535;
			c = Math.floor(v / 65536);
			t2 = v - c * 65536;
			v = t3 + c + 65535;
			c = Math.floor(v / 65536);
			t3 = v - c * 65536;
			v = t4 + c + 65535;
			c = Math.floor(v / 65536);
			t4 = v - c * 65536;
			v = t5 + c + 65535;
			c = Math.floor(v / 65536);
			t5 = v - c * 65536;
			v = t6 + c + 65535;
			c = Math.floor(v / 65536);
			t6 = v - c * 65536;
			v = t7 + c + 65535;
			c = Math.floor(v / 65536);
			t7 = v - c * 65536;
			v = t8 + c + 65535;
			c = Math.floor(v / 65536);
			t8 = v - c * 65536;
			v = t9 + c + 65535;
			c = Math.floor(v / 65536);
			t9 = v - c * 65536;
			v = t10 + c + 65535;
			c = Math.floor(v / 65536);
			t10 = v - c * 65536;
			v = t11 + c + 65535;
			c = Math.floor(v / 65536);
			t11 = v - c * 65536;
			v = t12 + c + 65535;
			c = Math.floor(v / 65536);
			t12 = v - c * 65536;
			v = t13 + c + 65535;
			c = Math.floor(v / 65536);
			t13 = v - c * 65536;
			v = t14 + c + 65535;
			c = Math.floor(v / 65536);
			t14 = v - c * 65536;
			v = t15 + c + 65535;
			c = Math.floor(v / 65536);
			t15 = v - c * 65536;
			t0 += c - 1 + 37 * (c - 1);
			o[0] = t0;
			o[1] = t1;
			o[2] = t2;
			o[3] = t3;
			o[4] = t4;
			o[5] = t5;
			o[6] = t6;
			o[7] = t7;
			o[8] = t8;
			o[9] = t9;
			o[10] = t10;
			o[11] = t11;
			o[12] = t12;
			o[13] = t13;
			o[14] = t14;
			o[15] = t15;
		}
		function S(o, a) {
			M(o, a, a);
		}
		function inv25519(o, i) {
			var c = gf();
			var a;
			for (a = 0; a < 16; a++) c[a] = i[a];
			for (a = 253; a >= 0; a--) {
				S(c, c);
				if (a !== 2 && a !== 4) M(c, c, i);
			}
			for (a = 0; a < 16; a++) o[a] = c[a];
		}
		function pow2523(o, i) {
			var c = gf();
			var a;
			for (a = 0; a < 16; a++) c[a] = i[a];
			for (a = 250; a >= 0; a--) {
				S(c, c);
				if (a !== 1) M(c, c, i);
			}
			for (a = 0; a < 16; a++) o[a] = c[a];
		}
		function crypto_scalarmult(q, n, p) {
			var z = /* @__PURE__ */ new Uint8Array(32);
			var x = /* @__PURE__ */ new Float64Array(80), r, i;
			var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf();
			for (i = 0; i < 31; i++) z[i] = n[i];
			z[31] = n[31] & 127 | 64;
			z[0] &= 248;
			unpack25519(x, p);
			for (i = 0; i < 16; i++) {
				b[i] = x[i];
				d[i] = a[i] = c[i] = 0;
			}
			a[0] = d[0] = 1;
			for (i = 254; i >= 0; --i) {
				r = z[i >>> 3] >>> (i & 7) & 1;
				sel25519(a, b, r);
				sel25519(c, d, r);
				A(e, a, c);
				Z(a, a, c);
				A(c, b, d);
				Z(b, b, d);
				S(d, e);
				S(f, a);
				M(a, c, a);
				M(c, b, e);
				A(e, a, c);
				Z(a, a, c);
				S(b, a);
				Z(c, d, f);
				M(a, c, _121665);
				A(a, a, d);
				M(c, c, a);
				M(a, d, f);
				M(d, b, x);
				S(b, e);
				sel25519(a, b, r);
				sel25519(c, d, r);
			}
			for (i = 0; i < 16; i++) {
				x[i + 16] = a[i];
				x[i + 32] = c[i];
				x[i + 48] = b[i];
				x[i + 64] = d[i];
			}
			var x32 = x.subarray(32);
			var x16 = x.subarray(16);
			inv25519(x32, x32);
			M(x16, x16, x32);
			pack25519(q, x16);
			return 0;
		}
		function crypto_scalarmult_base(q, n) {
			return crypto_scalarmult(q, n, _9);
		}
		function crypto_box_keypair(y, x) {
			randombytes(x, 32);
			return crypto_scalarmult_base(y, x);
		}
		function crypto_box_beforenm(k, y, x) {
			var s = /* @__PURE__ */ new Uint8Array(32);
			crypto_scalarmult(s, x, y);
			return crypto_core_hsalsa20(k, _0, s, sigma);
		}
		var crypto_box_afternm = crypto_secretbox;
		var crypto_box_open_afternm = crypto_secretbox_open;
		function crypto_box(c, m, d, n, y, x) {
			var k = /* @__PURE__ */ new Uint8Array(32);
			crypto_box_beforenm(k, y, x);
			return crypto_box_afternm(c, m, d, n, k);
		}
		function crypto_box_open(m, c, d, n, y, x) {
			var k = /* @__PURE__ */ new Uint8Array(32);
			crypto_box_beforenm(k, y, x);
			return crypto_box_open_afternm(m, c, d, n, k);
		}
		var K = [
			1116352408,
			3609767458,
			1899447441,
			602891725,
			3049323471,
			3964484399,
			3921009573,
			2173295548,
			961987163,
			4081628472,
			1508970993,
			3053834265,
			2453635748,
			2937671579,
			2870763221,
			3664609560,
			3624381080,
			2734883394,
			310598401,
			1164996542,
			607225278,
			1323610764,
			1426881987,
			3590304994,
			1925078388,
			4068182383,
			2162078206,
			991336113,
			2614888103,
			633803317,
			3248222580,
			3479774868,
			3835390401,
			2666613458,
			4022224774,
			944711139,
			264347078,
			2341262773,
			604807628,
			2007800933,
			770255983,
			1495990901,
			1249150122,
			1856431235,
			1555081692,
			3175218132,
			1996064986,
			2198950837,
			2554220882,
			3999719339,
			2821834349,
			766784016,
			2952996808,
			2566594879,
			3210313671,
			3203337956,
			3336571891,
			1034457026,
			3584528711,
			2466948901,
			113926993,
			3758326383,
			338241895,
			168717936,
			666307205,
			1188179964,
			773529912,
			1546045734,
			1294757372,
			1522805485,
			1396182291,
			2643833823,
			1695183700,
			2343527390,
			1986661051,
			1014477480,
			2177026350,
			1206759142,
			2456956037,
			344077627,
			2730485921,
			1290863460,
			2820302411,
			3158454273,
			3259730800,
			3505952657,
			3345764771,
			106217008,
			3516065817,
			3606008344,
			3600352804,
			1432725776,
			4094571909,
			1467031594,
			275423344,
			851169720,
			430227734,
			3100823752,
			506948616,
			1363258195,
			659060556,
			3750685593,
			883997877,
			3785050280,
			958139571,
			3318307427,
			1322822218,
			3812723403,
			1537002063,
			2003034995,
			1747873779,
			3602036899,
			1955562222,
			1575990012,
			2024104815,
			1125592928,
			2227730452,
			2716904306,
			2361852424,
			442776044,
			2428436474,
			593698344,
			2756734187,
			3733110249,
			3204031479,
			2999351573,
			3329325298,
			3815920427,
			3391569614,
			3928383900,
			3515267271,
			566280711,
			3940187606,
			3454069534,
			4118630271,
			4000239992,
			116418474,
			1914138554,
			174292421,
			2731055270,
			289380356,
			3203993006,
			460393269,
			320620315,
			685471733,
			587496836,
			852142971,
			1086792851,
			1017036298,
			365543100,
			1126000580,
			2618297676,
			1288033470,
			3409855158,
			1501505948,
			4234509866,
			1607167915,
			987167468,
			1816402316,
			1246189591
		];
		function crypto_hashblocks_hl(hh, hl, m, n) {
			var wh = /* @__PURE__ */ new Int32Array(16), wl = /* @__PURE__ */ new Int32Array(16), bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
			var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
			var pos = 0;
			while (n >= 128) {
				for (i = 0; i < 16; i++) {
					j = 8 * i + pos;
					wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
					wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
				}
				for (i = 0; i < 80; i++) {
					bh0 = ah0;
					bh1 = ah1;
					bh2 = ah2;
					bh3 = ah3;
					bh4 = ah4;
					bh5 = ah5;
					bh6 = ah6;
					bh7 = ah7;
					bl0 = al0;
					bl1 = al1;
					bl2 = al2;
					bl3 = al3;
					bl4 = al4;
					bl5 = al5;
					bl6 = al6;
					bl7 = al7;
					h = ah7;
					l = al7;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = (ah4 >>> 14 | al4 << 18) ^ (ah4 >>> 18 | al4 << 14) ^ (al4 >>> 9 | ah4 << 23);
					l = (al4 >>> 14 | ah4 << 18) ^ (al4 >>> 18 | ah4 << 14) ^ (ah4 >>> 9 | al4 << 23);
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = ah4 & ah5 ^ ~ah4 & ah6;
					l = al4 & al5 ^ ~al4 & al6;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = K[i * 2];
					l = K[i * 2 + 1];
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = wh[i % 16];
					l = wl[i % 16];
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					th = c & 65535 | d << 16;
					tl = a & 65535 | b << 16;
					h = th;
					l = tl;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = (ah0 >>> 28 | al0 << 4) ^ (al0 >>> 2 | ah0 << 30) ^ (al0 >>> 7 | ah0 << 25);
					l = (al0 >>> 28 | ah0 << 4) ^ (ah0 >>> 2 | al0 << 30) ^ (ah0 >>> 7 | al0 << 25);
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
					l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					bh7 = c & 65535 | d << 16;
					bl7 = a & 65535 | b << 16;
					h = bh3;
					l = bl3;
					a = l & 65535;
					b = l >>> 16;
					c = h & 65535;
					d = h >>> 16;
					h = th;
					l = tl;
					a += l & 65535;
					b += l >>> 16;
					c += h & 65535;
					d += h >>> 16;
					b += a >>> 16;
					c += b >>> 16;
					d += c >>> 16;
					bh3 = c & 65535 | d << 16;
					bl3 = a & 65535 | b << 16;
					ah1 = bh0;
					ah2 = bh1;
					ah3 = bh2;
					ah4 = bh3;
					ah5 = bh4;
					ah6 = bh5;
					ah7 = bh6;
					ah0 = bh7;
					al1 = bl0;
					al2 = bl1;
					al3 = bl2;
					al4 = bl3;
					al5 = bl4;
					al6 = bl5;
					al7 = bl6;
					al0 = bl7;
					if (i % 16 === 15) for (j = 0; j < 16; j++) {
						h = wh[j];
						l = wl[j];
						a = l & 65535;
						b = l >>> 16;
						c = h & 65535;
						d = h >>> 16;
						h = wh[(j + 9) % 16];
						l = wl[(j + 9) % 16];
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						th = wh[(j + 1) % 16];
						tl = wl[(j + 1) % 16];
						h = (th >>> 1 | tl << 31) ^ (th >>> 8 | tl << 24) ^ th >>> 7;
						l = (tl >>> 1 | th << 31) ^ (tl >>> 8 | th << 24) ^ (tl >>> 7 | th << 25);
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						th = wh[(j + 14) % 16];
						tl = wl[(j + 14) % 16];
						h = (th >>> 19 | tl << 13) ^ (tl >>> 29 | th << 3) ^ th >>> 6;
						l = (tl >>> 19 | th << 13) ^ (th >>> 29 | tl << 3) ^ (tl >>> 6 | th << 26);
						a += l & 65535;
						b += l >>> 16;
						c += h & 65535;
						d += h >>> 16;
						b += a >>> 16;
						c += b >>> 16;
						d += c >>> 16;
						wh[j] = c & 65535 | d << 16;
						wl[j] = a & 65535 | b << 16;
					}
				}
				h = ah0;
				l = al0;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[0];
				l = hl[0];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[0] = ah0 = c & 65535 | d << 16;
				hl[0] = al0 = a & 65535 | b << 16;
				h = ah1;
				l = al1;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[1];
				l = hl[1];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[1] = ah1 = c & 65535 | d << 16;
				hl[1] = al1 = a & 65535 | b << 16;
				h = ah2;
				l = al2;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[2];
				l = hl[2];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[2] = ah2 = c & 65535 | d << 16;
				hl[2] = al2 = a & 65535 | b << 16;
				h = ah3;
				l = al3;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[3];
				l = hl[3];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[3] = ah3 = c & 65535 | d << 16;
				hl[3] = al3 = a & 65535 | b << 16;
				h = ah4;
				l = al4;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[4];
				l = hl[4];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[4] = ah4 = c & 65535 | d << 16;
				hl[4] = al4 = a & 65535 | b << 16;
				h = ah5;
				l = al5;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[5];
				l = hl[5];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[5] = ah5 = c & 65535 | d << 16;
				hl[5] = al5 = a & 65535 | b << 16;
				h = ah6;
				l = al6;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[6];
				l = hl[6];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[6] = ah6 = c & 65535 | d << 16;
				hl[6] = al6 = a & 65535 | b << 16;
				h = ah7;
				l = al7;
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = hh[7];
				l = hl[7];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				hh[7] = ah7 = c & 65535 | d << 16;
				hl[7] = al7 = a & 65535 | b << 16;
				pos += 128;
				n -= 128;
			}
			return n;
		}
		function crypto_hash(out, m, n) {
			var hh = /* @__PURE__ */ new Int32Array(8), hl = /* @__PURE__ */ new Int32Array(8), x = /* @__PURE__ */ new Uint8Array(256), i, b = n;
			hh[0] = 1779033703;
			hh[1] = 3144134277;
			hh[2] = 1013904242;
			hh[3] = 2773480762;
			hh[4] = 1359893119;
			hh[5] = 2600822924;
			hh[6] = 528734635;
			hh[7] = 1541459225;
			hl[0] = 4089235720;
			hl[1] = 2227873595;
			hl[2] = 4271175723;
			hl[3] = 1595750129;
			hl[4] = 2917565137;
			hl[5] = 725511199;
			hl[6] = 4215389547;
			hl[7] = 327033209;
			crypto_hashblocks_hl(hh, hl, m, n);
			n %= 128;
			for (i = 0; i < n; i++) x[i] = m[b - n + i];
			x[n] = 128;
			n = 256 - 128 * (n < 112 ? 1 : 0);
			x[n - 9] = 0;
			ts64(x, n - 8, b / 536870912 | 0, b << 3);
			crypto_hashblocks_hl(hh, hl, x, n);
			for (i = 0; i < 8; i++) ts64(out, 8 * i, hh[i], hl[i]);
			return 0;
		}
		function add(p, q) {
			var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
			Z(a, p[1], p[0]);
			Z(t, q[1], q[0]);
			M(a, a, t);
			A(b, p[0], p[1]);
			A(t, q[0], q[1]);
			M(b, b, t);
			M(c, p[3], q[3]);
			M(c, c, D2);
			M(d, p[2], q[2]);
			A(d, d, d);
			Z(e, b, a);
			Z(f, d, c);
			A(g, d, c);
			A(h, b, a);
			M(p[0], e, f);
			M(p[1], h, g);
			M(p[2], g, f);
			M(p[3], e, h);
		}
		function cswap(p, q, b) {
			var i;
			for (i = 0; i < 4; i++) sel25519(p[i], q[i], b);
		}
		function pack(r, p) {
			var tx = gf(), ty = gf(), zi = gf();
			inv25519(zi, p[2]);
			M(tx, p[0], zi);
			M(ty, p[1], zi);
			pack25519(r, ty);
			r[31] ^= par25519(tx) << 7;
		}
		function scalarmult(p, q, s) {
			var b, i;
			set25519(p[0], gf0);
			set25519(p[1], gf1);
			set25519(p[2], gf1);
			set25519(p[3], gf0);
			for (i = 255; i >= 0; --i) {
				b = s[i / 8 | 0] >> (i & 7) & 1;
				cswap(p, q, b);
				add(q, p);
				add(p, p);
				cswap(p, q, b);
			}
		}
		function scalarbase(p, s) {
			var q = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			set25519(q[0], X);
			set25519(q[1], Y);
			set25519(q[2], gf1);
			M(q[3], X, Y);
			scalarmult(p, q, s);
		}
		function crypto_sign_keypair(pk, sk, seeded) {
			var d = /* @__PURE__ */ new Uint8Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			var i;
			if (!seeded) randombytes(sk, 32);
			crypto_hash(d, sk, 32);
			d[0] &= 248;
			d[31] &= 127;
			d[31] |= 64;
			scalarbase(p, d);
			pack(pk, p);
			for (i = 0; i < 32; i++) sk[i + 32] = pk[i];
			return 0;
		}
		var L = new Float64Array([
			237,
			211,
			245,
			92,
			26,
			99,
			18,
			88,
			214,
			156,
			247,
			162,
			222,
			249,
			222,
			20,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			16
		]);
		function modL(r, x) {
			var carry, i, j, k;
			for (i = 63; i >= 32; --i) {
				carry = 0;
				for (j = i - 32, k = i - 12; j < k; ++j) {
					x[j] += carry - 16 * x[i] * L[j - (i - 32)];
					carry = Math.floor((x[j] + 128) / 256);
					x[j] -= carry * 256;
				}
				x[j] += carry;
				x[i] = 0;
			}
			carry = 0;
			for (j = 0; j < 32; j++) {
				x[j] += carry - (x[31] >> 4) * L[j];
				carry = x[j] >> 8;
				x[j] &= 255;
			}
			for (j = 0; j < 32; j++) x[j] -= carry * L[j];
			for (i = 0; i < 32; i++) {
				x[i + 1] += x[i] >> 8;
				r[i] = x[i] & 255;
			}
		}
		function reduce(r) {
			var x = /* @__PURE__ */ new Float64Array(64), i;
			for (i = 0; i < 64; i++) x[i] = r[i];
			for (i = 0; i < 64; i++) r[i] = 0;
			modL(r, x);
		}
		function crypto_sign(sm, m, n, sk) {
			var d = /* @__PURE__ */ new Uint8Array(64), h = /* @__PURE__ */ new Uint8Array(64), r = /* @__PURE__ */ new Uint8Array(64);
			var i, j, x = /* @__PURE__ */ new Float64Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			crypto_hash(d, sk, 32);
			d[0] &= 248;
			d[31] &= 127;
			d[31] |= 64;
			var smlen = n + 64;
			for (i = 0; i < n; i++) sm[64 + i] = m[i];
			for (i = 0; i < 32; i++) sm[32 + i] = d[32 + i];
			crypto_hash(r, sm.subarray(32), n + 32);
			reduce(r);
			scalarbase(p, r);
			pack(sm, p);
			for (i = 32; i < 64; i++) sm[i] = sk[i];
			crypto_hash(h, sm, n + 64);
			reduce(h);
			for (i = 0; i < 64; i++) x[i] = 0;
			for (i = 0; i < 32; i++) x[i] = r[i];
			for (i = 0; i < 32; i++) for (j = 0; j < 32; j++) x[i + j] += h[i] * d[j];
			modL(sm.subarray(32), x);
			return smlen;
		}
		function unpackneg(r, p) {
			var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
			set25519(r[2], gf1);
			unpack25519(r[1], p);
			S(num, r[1]);
			M(den, num, D);
			Z(num, num, r[2]);
			A(den, r[2], den);
			S(den2, den);
			S(den4, den2);
			M(den6, den4, den2);
			M(t, den6, num);
			M(t, t, den);
			pow2523(t, t);
			M(t, t, num);
			M(t, t, den);
			M(t, t, den);
			M(r[0], t, den);
			S(chk, r[0]);
			M(chk, chk, den);
			if (neq25519(chk, num)) M(r[0], r[0], I);
			S(chk, r[0]);
			M(chk, chk, den);
			if (neq25519(chk, num)) return -1;
			if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
			M(r[3], r[0], r[1]);
			return 0;
		}
		function crypto_sign_open(m, sm, n, pk) {
			var i;
			var t = /* @__PURE__ */ new Uint8Array(32), h = /* @__PURE__ */ new Uint8Array(64);
			var p = [
				gf(),
				gf(),
				gf(),
				gf()
			], q = [
				gf(),
				gf(),
				gf(),
				gf()
			];
			if (n < 64) return -1;
			if (unpackneg(q, pk)) return -1;
			for (i = 0; i < n; i++) m[i] = sm[i];
			for (i = 0; i < 32; i++) m[i + 32] = pk[i];
			crypto_hash(h, m, n);
			reduce(h);
			scalarmult(p, q, h);
			scalarbase(q, sm.subarray(32));
			add(p, q);
			pack(t, p);
			n -= 64;
			if (crypto_verify_32(sm, 0, t, 0)) {
				for (i = 0; i < n; i++) m[i] = 0;
				return -1;
			}
			for (i = 0; i < n; i++) m[i] = sm[i + 64];
			return n;
		}
		var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
		nacl.lowlevel = {
			crypto_core_hsalsa20,
			crypto_stream_xor,
			crypto_stream,
			crypto_stream_salsa20_xor,
			crypto_stream_salsa20,
			crypto_onetimeauth,
			crypto_onetimeauth_verify,
			crypto_verify_16,
			crypto_verify_32,
			crypto_secretbox,
			crypto_secretbox_open,
			crypto_scalarmult,
			crypto_scalarmult_base,
			crypto_box_beforenm,
			crypto_box_afternm,
			crypto_box,
			crypto_box_open,
			crypto_box_keypair,
			crypto_hash,
			crypto_sign,
			crypto_sign_keypair,
			crypto_sign_open,
			crypto_secretbox_KEYBYTES,
			crypto_secretbox_NONCEBYTES,
			crypto_secretbox_ZEROBYTES,
			crypto_secretbox_BOXZEROBYTES,
			crypto_scalarmult_BYTES,
			crypto_scalarmult_SCALARBYTES,
			crypto_box_PUBLICKEYBYTES,
			crypto_box_SECRETKEYBYTES,
			crypto_box_BEFORENMBYTES,
			crypto_box_NONCEBYTES,
			crypto_box_ZEROBYTES,
			crypto_box_BOXZEROBYTES,
			crypto_sign_BYTES,
			crypto_sign_PUBLICKEYBYTES,
			crypto_sign_SECRETKEYBYTES,
			crypto_sign_SEEDBYTES,
			crypto_hash_BYTES,
			gf,
			D,
			L,
			pack25519,
			unpack25519,
			M,
			A,
			S,
			Z,
			pow2523,
			add,
			set25519,
			modL,
			scalarmult,
			scalarbase
		};
		function checkLengths(k, n) {
			if (k.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
			if (n.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
		}
		function checkBoxLengths(pk, sk) {
			if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
			if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
		}
		function checkArrayTypes() {
			for (var i = 0; i < arguments.length; i++) if (!(arguments[i] instanceof Uint8Array)) throw new TypeError("unexpected type, use Uint8Array");
		}
		function cleanup(arr) {
			for (var i = 0; i < arr.length; i++) arr[i] = 0;
		}
		nacl.randomBytes = function(n) {
			var b = new Uint8Array(n);
			randombytes(b, n);
			return b;
		};
		nacl.secretbox = function(msg, nonce, key) {
			checkArrayTypes(msg, nonce, key);
			checkLengths(key, nonce);
			var m = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
			var c = new Uint8Array(m.length);
			for (var i = 0; i < msg.length; i++) m[i + crypto_secretbox_ZEROBYTES] = msg[i];
			crypto_secretbox(c, m, m.length, nonce, key);
			return c.subarray(crypto_secretbox_BOXZEROBYTES);
		};
		nacl.secretbox.open = function(box, nonce, key) {
			checkArrayTypes(box, nonce, key);
			checkLengths(key, nonce);
			var c = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
			var m = new Uint8Array(c.length);
			for (var i = 0; i < box.length; i++) c[i + crypto_secretbox_BOXZEROBYTES] = box[i];
			if (c.length < 32) return null;
			if (crypto_secretbox_open(m, c, c.length, nonce, key) !== 0) return null;
			return m.subarray(crypto_secretbox_ZEROBYTES);
		};
		nacl.secretbox.keyLength = crypto_secretbox_KEYBYTES;
		nacl.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
		nacl.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
		nacl.scalarMult = function(n, p) {
			checkArrayTypes(n, p);
			if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
			if (p.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
			var q = new Uint8Array(crypto_scalarmult_BYTES);
			crypto_scalarmult(q, n, p);
			return q;
		};
		nacl.scalarMult.base = function(n) {
			checkArrayTypes(n);
			if (n.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
			var q = new Uint8Array(crypto_scalarmult_BYTES);
			crypto_scalarmult_base(q, n);
			return q;
		};
		nacl.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
		nacl.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
		nacl.box = function(msg, nonce, publicKey, secretKey) {
			var k = nacl.box.before(publicKey, secretKey);
			return nacl.secretbox(msg, nonce, k);
		};
		nacl.box.before = function(publicKey, secretKey) {
			checkArrayTypes(publicKey, secretKey);
			checkBoxLengths(publicKey, secretKey);
			var k = new Uint8Array(crypto_box_BEFORENMBYTES);
			crypto_box_beforenm(k, publicKey, secretKey);
			return k;
		};
		nacl.box.after = nacl.secretbox;
		nacl.box.open = function(msg, nonce, publicKey, secretKey) {
			var k = nacl.box.before(publicKey, secretKey);
			return nacl.secretbox.open(msg, nonce, k);
		};
		nacl.box.open.after = nacl.secretbox.open;
		nacl.box.keyPair = function() {
			var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
			crypto_box_keypair(pk, sk);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl.box.keyPair.fromSecretKey = function(secretKey) {
			checkArrayTypes(secretKey);
			if (secretKey.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
			var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
			crypto_scalarmult_base(pk, secretKey);
			return {
				publicKey: pk,
				secretKey: new Uint8Array(secretKey)
			};
		};
		nacl.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
		nacl.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
		nacl.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
		nacl.box.nonceLength = crypto_box_NONCEBYTES;
		nacl.box.overheadLength = nacl.secretbox.overheadLength;
		nacl.sign = function(msg, secretKey) {
			checkArrayTypes(msg, secretKey);
			if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
			var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
			crypto_sign(signedMsg, msg, msg.length, secretKey);
			return signedMsg;
		};
		nacl.sign.open = function(signedMsg, publicKey) {
			checkArrayTypes(signedMsg, publicKey);
			if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
			var tmp = new Uint8Array(signedMsg.length);
			var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
			if (mlen < 0) return null;
			var m = new Uint8Array(mlen);
			for (var i = 0; i < m.length; i++) m[i] = tmp[i];
			return m;
		};
		nacl.sign.detached = function(msg, secretKey) {
			var signedMsg = nacl.sign(msg, secretKey);
			var sig = new Uint8Array(crypto_sign_BYTES);
			for (var i = 0; i < sig.length; i++) sig[i] = signedMsg[i];
			return sig;
		};
		nacl.sign.detached.verify = function(msg, sig, publicKey) {
			checkArrayTypes(msg, sig, publicKey);
			if (sig.length !== crypto_sign_BYTES) throw new Error("bad signature size");
			if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
			var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
			var m = new Uint8Array(crypto_sign_BYTES + msg.length);
			var i;
			for (i = 0; i < crypto_sign_BYTES; i++) sm[i] = sig[i];
			for (i = 0; i < msg.length; i++) sm[i + crypto_sign_BYTES] = msg[i];
			return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
		};
		nacl.sign.keyPair = function() {
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
			crypto_sign_keypair(pk, sk);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl.sign.keyPair.fromSecretKey = function(secretKey) {
			checkArrayTypes(secretKey);
			if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			for (var i = 0; i < pk.length; i++) pk[i] = secretKey[32 + i];
			return {
				publicKey: pk,
				secretKey: new Uint8Array(secretKey)
			};
		};
		nacl.sign.keyPair.fromSeed = function(seed) {
			checkArrayTypes(seed);
			if (seed.length !== crypto_sign_SEEDBYTES) throw new Error("bad seed size");
			var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
			var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
			for (var i = 0; i < 32; i++) sk[i] = seed[i];
			crypto_sign_keypair(pk, sk, true);
			return {
				publicKey: pk,
				secretKey: sk
			};
		};
		nacl.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
		nacl.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
		nacl.sign.seedLength = crypto_sign_SEEDBYTES;
		nacl.sign.signatureLength = crypto_sign_BYTES;
		nacl.hash = function(msg) {
			checkArrayTypes(msg);
			var h = new Uint8Array(crypto_hash_BYTES);
			crypto_hash(h, msg, msg.length);
			return h;
		};
		nacl.hash.hashLength = crypto_hash_BYTES;
		nacl.verify = function(x, y) {
			checkArrayTypes(x, y);
			if (x.length === 0 || y.length === 0) return false;
			if (x.length !== y.length) return false;
			return vn(x, 0, y, 0, x.length) === 0 ? true : false;
		};
		nacl.setPRNG = function(fn) {
			randombytes = fn;
		};
		(function() {
			var crypto = typeof self !== "undefined" ? self.crypto || self.msCrypto : null;
			if (crypto && crypto.getRandomValues) {
				var QUOTA = 65536;
				nacl.setPRNG(function(x, n) {
					var i, v = new Uint8Array(n);
					for (i = 0; i < n; i += QUOTA) crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
					for (i = 0; i < n; i++) x[i] = v[i];
					cleanup(v);
				});
			} else if (typeof __require !== "undefined") {
				crypto = __require("crypto");
				if (crypto && crypto.randomBytes) nacl.setPRNG(function(x, n) {
					var i, v = crypto.randomBytes(n);
					for (i = 0; i < n; i++) x[i] = v[i];
					cleanup(v);
				});
			}
		})();
	})(typeof module !== "undefined" && module.exports ? module.exports : self.nacl = self.nacl || {});
}));
//#endregion
//#region node_modules/bignumber.js/bignumber.js
var require_bignumber = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(globalObject) {
		"use strict";
		var BigNumber, isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i, mathceil = Math.ceil, mathfloor = Math.floor, bignumberError = "[BigNumber Error] ", tooManyDigits = bignumberError + "Number primitive has more than 15 significant digits: ", BASE = 0x5af3107a4000, LOG_BASE = 14, MAX_SAFE_INTEGER = 9007199254740991, POWS_TEN = [
			1,
			10,
			100,
			1e3,
			1e4,
			1e5,
			1e6,
			1e7,
			1e8,
			1e9,
			1e10,
			1e11,
			0xe8d4a51000,
			0x9184e72a000
		], SQRT_BASE = 1e7, MAX = 1e9;
		function clone(configObject) {
			var div, convertBase, parseNumeric, P = BigNumber.prototype = {
				constructor: BigNumber,
				toString: null,
				valueOf: null
			}, ONE = new BigNumber(1), DECIMAL_PLACES = 20, ROUNDING_MODE = 4, TO_EXP_NEG = -7, TO_EXP_POS = 21, MIN_EXP = -1e7, MAX_EXP = 1e7, CRYPTO = false, MODULO_MODE = 1, POW_PRECISION = 0, FORMAT = {
				prefix: "",
				groupSize: 3,
				secondaryGroupSize: 0,
				groupSeparator: ",",
				decimalSeparator: ".",
				fractionGroupSize: 0,
				fractionGroupSeparator: "\xA0",
				suffix: ""
			}, ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", alphabetHasNormalDecimalDigits = true;
			function BigNumber(v, b) {
				var alphabet, c, caseChanged, e, i, isNum, len, str, x = this;
				if (!(x instanceof BigNumber)) return new BigNumber(v, b);
				if (b == null) {
					if (v && v._isBigNumber === true) {
						x.s = v.s;
						if (!v.c || v.e > MAX_EXP) x.c = x.e = null;
						else if (v.e < MIN_EXP) x.c = [x.e = 0];
						else {
							x.e = v.e;
							x.c = v.c.slice();
						}
						return;
					}
					if ((isNum = typeof v == "number") && v * 0 == 0) {
						x.s = 1 / v < 0 ? (v = -v, -1) : 1;
						if (v === ~~v) {
							for (e = 0, i = v; i >= 10; i /= 10, e++);
							if (e > MAX_EXP) x.c = x.e = null;
							else {
								x.e = e;
								x.c = [v];
							}
							return;
						}
						str = String(v);
					} else {
						if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
						x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
					}
					if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
					if ((i = str.search(/e/i)) > 0) {
						if (e < 0) e = i;
						e += +str.slice(i + 1);
						str = str.substring(0, i);
					} else if (e < 0) e = str.length;
				} else {
					intCheck(b, 2, ALPHABET.length, "Base");
					if (b == 10 && alphabetHasNormalDecimalDigits) {
						x = new BigNumber(v);
						return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
					}
					str = String(v);
					if (isNum = typeof v == "number") {
						if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
						x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;
						if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, "").length > 15) throw Error(tooManyDigits + v);
					} else x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
					alphabet = ALPHABET.slice(0, b);
					e = i = 0;
					for (len = str.length; i < len; i++) if (alphabet.indexOf(c = str.charAt(i)) < 0) {
						if (c == ".") {
							if (i > e) {
								e = len;
								continue;
							}
						} else if (!caseChanged) {
							if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
								caseChanged = true;
								i = -1;
								e = 0;
								continue;
							}
						}
						return parseNumeric(x, String(v), isNum, b);
					}
					isNum = false;
					str = convertBase(str, b, 10, x.s);
					if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
					else e = str.length;
				}
				for (i = 0; str.charCodeAt(i) === 48; i++);
				for (len = str.length; str.charCodeAt(--len) === 48;);
				if (str = str.slice(i, ++len)) {
					len -= i;
					if (isNum && BigNumber.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) throw Error(tooManyDigits + x.s * v);
					if ((e = e - i - 1) > MAX_EXP) x.c = x.e = null;
					else if (e < MIN_EXP) x.c = [x.e = 0];
					else {
						x.e = e;
						x.c = [];
						i = (e + 1) % LOG_BASE;
						if (e < 0) i += LOG_BASE;
						if (i < len) {
							if (i) x.c.push(+str.slice(0, i));
							for (len -= LOG_BASE; i < len;) x.c.push(+str.slice(i, i += LOG_BASE));
							i = LOG_BASE - (str = str.slice(i)).length;
						} else i -= len;
						for (; i--; str += "0");
						x.c.push(+str);
					}
				} else x.c = [x.e = 0];
			}
			BigNumber.clone = clone;
			BigNumber.ROUND_UP = 0;
			BigNumber.ROUND_DOWN = 1;
			BigNumber.ROUND_CEIL = 2;
			BigNumber.ROUND_FLOOR = 3;
			BigNumber.ROUND_HALF_UP = 4;
			BigNumber.ROUND_HALF_DOWN = 5;
			BigNumber.ROUND_HALF_EVEN = 6;
			BigNumber.ROUND_HALF_CEIL = 7;
			BigNumber.ROUND_HALF_FLOOR = 8;
			BigNumber.EUCLID = 9;
			BigNumber.config = BigNumber.set = function(obj) {
				var p, v;
				if (obj != null) {
					if (typeof obj == "object") {
						if (obj.hasOwnProperty(p = "DECIMAL_PLACES")) {
							v = obj[p];
							intCheck(v, 0, MAX, p);
							DECIMAL_PLACES = v;
						}
						if (obj.hasOwnProperty(p = "ROUNDING_MODE")) {
							v = obj[p];
							intCheck(v, 0, 8, p);
							ROUNDING_MODE = v;
						}
						if (obj.hasOwnProperty(p = "EXPONENTIAL_AT")) {
							v = obj[p];
							if (v && v.pop) {
								intCheck(v[0], -MAX, 0, p);
								intCheck(v[1], 0, MAX, p);
								TO_EXP_NEG = v[0];
								TO_EXP_POS = v[1];
							} else {
								intCheck(v, -MAX, MAX, p);
								TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
							}
						}
						if (obj.hasOwnProperty(p = "RANGE")) {
							v = obj[p];
							if (v && v.pop) {
								intCheck(v[0], -MAX, -1, p);
								intCheck(v[1], 1, MAX, p);
								MIN_EXP = v[0];
								MAX_EXP = v[1];
							} else {
								intCheck(v, -MAX, MAX, p);
								if (v) MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
								else throw Error(bignumberError + p + " cannot be zero: " + v);
							}
						}
						if (obj.hasOwnProperty(p = "CRYPTO")) {
							v = obj[p];
							if (v === !!v) {
								if (v) {
									if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) CRYPTO = v;
									else {
										CRYPTO = !v;
										throw Error(bignumberError + "crypto unavailable");
									}
								} else CRYPTO = v;
							} else throw Error(bignumberError + p + " not true or false: " + v);
						}
						if (obj.hasOwnProperty(p = "MODULO_MODE")) {
							v = obj[p];
							intCheck(v, 0, 9, p);
							MODULO_MODE = v;
						}
						if (obj.hasOwnProperty(p = "POW_PRECISION")) {
							v = obj[p];
							intCheck(v, 0, MAX, p);
							POW_PRECISION = v;
						}
						if (obj.hasOwnProperty(p = "FORMAT")) {
							v = obj[p];
							if (typeof v == "object") FORMAT = v;
							else throw Error(bignumberError + p + " not an object: " + v);
						}
						if (obj.hasOwnProperty(p = "ALPHABET")) {
							v = obj[p];
							if (typeof v == "string" && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
								alphabetHasNormalDecimalDigits = v.slice(0, 10) == "0123456789";
								ALPHABET = v;
							} else throw Error(bignumberError + p + " invalid: " + v);
						}
					} else throw Error(bignumberError + "Object expected: " + obj);
				}
				return {
					DECIMAL_PLACES,
					ROUNDING_MODE,
					EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
					RANGE: [MIN_EXP, MAX_EXP],
					CRYPTO,
					MODULO_MODE,
					POW_PRECISION,
					FORMAT,
					ALPHABET
				};
			};
			BigNumber.isBigNumber = function(v) {
				if (!v || v._isBigNumber !== true) return false;
				if (!BigNumber.DEBUG) return true;
				var i, n, c = v.c, e = v.e, s = v.s;
				out: if ({}.toString.call(c) == "[object Array]") {
					if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
						if (c[0] === 0) {
							if (e === 0 && c.length === 1) return true;
							break out;
						}
						i = (e + 1) % LOG_BASE;
						if (i < 1) i += LOG_BASE;
						if (String(c[0]).length == i) {
							for (i = 0; i < c.length; i++) {
								n = c[i];
								if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
							}
							if (n !== 0) return true;
						}
					}
				} else if (c === null && e === null && (s === null || s === 1 || s === -1)) return true;
				throw Error(bignumberError + "Invalid BigNumber: " + v);
			};
			BigNumber.maximum = BigNumber.max = function() {
				return maxOrMin(arguments, -1);
			};
			BigNumber.minimum = BigNumber.min = function() {
				return maxOrMin(arguments, 1);
			};
			BigNumber.random = (function() {
				var pow2_53 = 9007199254740992;
				var random53bitInt = Math.random() * pow2_53 & 2097151 ? function() {
					return mathfloor(Math.random() * pow2_53);
				} : function() {
					return (Math.random() * 1073741824 | 0) * 8388608 + (Math.random() * 8388608 | 0);
				};
				return function(dp) {
					var a, b, e, k, v, i = 0, c = [], rand = new BigNumber(ONE);
					if (dp == null) dp = DECIMAL_PLACES;
					else intCheck(dp, 0, MAX);
					k = mathceil(dp / LOG_BASE);
					if (CRYPTO) {
						if (crypto.getRandomValues) {
							a = crypto.getRandomValues(new Uint32Array(k *= 2));
							for (; i < k;) {
								v = a[i] * 131072 + (a[i + 1] >>> 11);
								if (v >= 9e15) {
									b = crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(2));
									a[i] = b[0];
									a[i + 1] = b[1];
								} else {
									c.push(v % 0x5af3107a4000);
									i += 2;
								}
							}
							i = k / 2;
						} else if (crypto.randomBytes) {
							a = crypto.randomBytes(k *= 7);
							for (; i < k;) {
								v = (a[i] & 31) * 281474976710656 + a[i + 1] * 1099511627776 + a[i + 2] * 4294967296 + a[i + 3] * 16777216 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
								if (v >= 9e15) crypto.randomBytes(7).copy(a, i);
								else {
									c.push(v % 0x5af3107a4000);
									i += 7;
								}
							}
							i = k / 7;
						} else {
							CRYPTO = false;
							throw Error(bignumberError + "crypto unavailable");
						}
					}
					if (!CRYPTO) for (; i < k;) {
						v = random53bitInt();
						if (v < 9e15) c[i++] = v % 0x5af3107a4000;
					}
					k = c[--i];
					dp %= LOG_BASE;
					if (k && dp) {
						v = POWS_TEN[LOG_BASE - dp];
						c[i] = mathfloor(k / v) * v;
					}
					for (; c[i] === 0; c.pop(), i--);
					if (i < 0) c = [e = 0];
					else {
						for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);
						for (i = 1, v = c[0]; v >= 10; v /= 10, i++);
						if (i < LOG_BASE) e -= LOG_BASE - i;
					}
					rand.e = e;
					rand.c = c;
					return rand;
				};
			})();
			BigNumber.sum = function() {
				var i = 1, args = arguments, sum = new BigNumber(args[0]);
				for (; i < args.length;) sum = sum.plus(args[i++]);
				return sum;
			};
			convertBase = (function() {
				var decimal = "0123456789";
				function toBaseOut(str, baseIn, baseOut, alphabet) {
					var j, arr = [0], arrL, i = 0, len = str.length;
					for (; i < len;) {
						for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);
						arr[0] += alphabet.indexOf(str.charAt(i++));
						for (j = 0; j < arr.length; j++) if (arr[j] > baseOut - 1) {
							if (arr[j + 1] == null) arr[j + 1] = 0;
							arr[j + 1] += arr[j] / baseOut | 0;
							arr[j] %= baseOut;
						}
					}
					return arr.reverse();
				}
				return function(str, baseIn, baseOut, sign, callerIsToString) {
					var alphabet, d, e, k, r, x, xc, y, i = str.indexOf("."), dp = DECIMAL_PLACES, rm = ROUNDING_MODE;
					if (i >= 0) {
						k = POW_PRECISION;
						POW_PRECISION = 0;
						str = str.replace(".", "");
						y = new BigNumber(baseIn);
						x = y.pow(str.length - i);
						POW_PRECISION = k;
						y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, "0"), 10, baseOut, decimal);
						y.e = y.c.length;
					}
					xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));
					e = k = xc.length;
					for (; xc[--k] == 0; xc.pop());
					if (!xc[0]) return alphabet.charAt(0);
					if (i < 0) --e;
					else {
						x.c = xc;
						x.e = e;
						x.s = sign;
						x = div(x, y, dp, rm, baseOut);
						xc = x.c;
						r = x.r;
						e = x.e;
					}
					d = e + dp + 1;
					i = xc[d];
					k = baseOut / 2;
					r = r || d < 0 || xc[d + 1] != null;
					r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));
					if (d < 1 || !xc[0]) str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
					else {
						xc.length = d;
						if (r) for (--baseOut; ++xc[--d] > baseOut;) {
							xc[d] = 0;
							if (!d) {
								++e;
								xc = [1].concat(xc);
							}
						}
						for (k = xc.length; !xc[--k];);
						for (i = 0, str = ""; i <= k; str += alphabet.charAt(xc[i++]));
						str = toFixedPoint(str, e, alphabet.charAt(0));
					}
					return str;
				};
			})();
			div = (function() {
				function multiply(x, k, base) {
					var m, temp, xlo, xhi, carry = 0, i = x.length, klo = k % SQRT_BASE, khi = k / SQRT_BASE | 0;
					for (x = x.slice(); i--;) {
						xlo = x[i] % SQRT_BASE;
						xhi = x[i] / SQRT_BASE | 0;
						m = khi * xlo + xhi * klo;
						temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
						carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
						x[i] = temp % base;
					}
					if (carry) x = [carry].concat(x);
					return x;
				}
				function compare(a, b, aL, bL) {
					var i, cmp;
					if (aL != bL) cmp = aL > bL ? 1 : -1;
					else for (i = cmp = 0; i < aL; i++) if (a[i] != b[i]) {
						cmp = a[i] > b[i] ? 1 : -1;
						break;
					}
					return cmp;
				}
				function subtract(a, b, aL, base) {
					var i = 0;
					for (; aL--;) {
						a[aL] -= i;
						i = a[aL] < b[aL] ? 1 : 0;
						a[aL] = i * base + a[aL] - b[aL];
					}
					for (; !a[0] && a.length > 1; a.splice(0, 1));
				}
				return function(x, y, dp, rm, base) {
					var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0, yL, yz, s = x.s == y.s ? 1 : -1, xc = x.c, yc = y.c;
					if (!xc || !xc[0] || !yc || !yc[0]) return new BigNumber(!x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN : xc && xc[0] == 0 || !yc ? s * 0 : s / 0);
					q = new BigNumber(s);
					qc = q.c = [];
					e = x.e - y.e;
					s = dp + e + 1;
					if (!base) {
						base = BASE;
						e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
						s = s / LOG_BASE | 0;
					}
					for (i = 0; yc[i] == (xc[i] || 0); i++);
					if (yc[i] > (xc[i] || 0)) e--;
					if (s < 0) {
						qc.push(1);
						more = true;
					} else {
						xL = xc.length;
						yL = yc.length;
						i = 0;
						s += 2;
						n = mathfloor(base / (yc[0] + 1));
						if (n > 1) {
							yc = multiply(yc, n, base);
							xc = multiply(xc, n, base);
							yL = yc.length;
							xL = xc.length;
						}
						xi = yL;
						rem = xc.slice(0, yL);
						remL = rem.length;
						for (; remL < yL; rem[remL++] = 0);
						yz = yc.slice();
						yz = [0].concat(yz);
						yc0 = yc[0];
						if (yc[1] >= base / 2) yc0++;
						do {
							n = 0;
							cmp = compare(yc, rem, yL, remL);
							if (cmp < 0) {
								rem0 = rem[0];
								if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
								n = mathfloor(rem0 / yc0);
								if (n > 1) {
									if (n >= base) n = base - 1;
									prod = multiply(yc, n, base);
									prodL = prod.length;
									remL = rem.length;
									while (compare(prod, rem, prodL, remL) == 1) {
										n--;
										subtract(prod, yL < prodL ? yz : yc, prodL, base);
										prodL = prod.length;
										cmp = 1;
									}
								} else {
									if (n == 0) cmp = n = 1;
									prod = yc.slice();
									prodL = prod.length;
								}
								if (prodL < remL) prod = [0].concat(prod);
								subtract(rem, prod, remL, base);
								remL = rem.length;
								if (cmp == -1) while (compare(yc, rem, yL, remL) < 1) {
									n++;
									subtract(rem, yL < remL ? yz : yc, remL, base);
									remL = rem.length;
								}
							} else if (cmp === 0) {
								n++;
								rem = [0];
							}
							qc[i++] = n;
							if (rem[0]) rem[remL++] = xc[xi] || 0;
							else {
								rem = [xc[xi]];
								remL = 1;
							}
						} while ((xi++ < xL || rem[0] != null) && s--);
						more = rem[0] != null;
						if (!qc[0]) qc.splice(0, 1);
					}
					if (base == BASE) {
						for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);
						round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);
					} else {
						q.e = e;
						q.r = +more;
					}
					return q;
				};
			})();
			function format(n, i, rm, id) {
				var c0, e, ne, len, str;
				if (rm == null) rm = ROUNDING_MODE;
				else intCheck(rm, 0, 8);
				if (!n.c) return n.toString();
				c0 = n.c[0];
				ne = n.e;
				if (i == null) {
					str = coeffToString(n.c);
					str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, "0");
				} else {
					n = round(new BigNumber(n), i, rm);
					e = n.e;
					str = coeffToString(n.c);
					len = str.length;
					if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
						for (; len < i; str += "0", len++);
						str = toExponential(str, e);
					} else {
						i -= ne + (id === 2 && e > ne);
						str = toFixedPoint(str, e, "0");
						if (e + 1 > len) {
							if (--i > 0) for (str += "."; i--; str += "0");
						} else {
							i += e - len;
							if (i > 0) {
								if (e + 1 == len) str += ".";
								for (; i--; str += "0");
							}
						}
					}
				}
				return n.s < 0 && c0 ? "-" + str : str;
			}
			function maxOrMin(args, n) {
				var k, y, i = 1, x = new BigNumber(args[0]);
				for (; i < args.length; i++) {
					y = new BigNumber(args[i]);
					if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) x = y;
				}
				return x;
			}
			function normalise(n, c, e) {
				var i = 1, j = c.length;
				for (; !c[--j]; c.pop());
				for (j = c[0]; j >= 10; j /= 10, i++);
				if ((e = i + e * LOG_BASE - 1) > MAX_EXP) n.c = n.e = null;
				else if (e < MIN_EXP) n.c = [n.e = 0];
				else {
					n.e = e;
					n.c = c;
				}
				return n;
			}
			parseNumeric = (function() {
				var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i, dotAfter = /^([^.]+)\.$/, dotBefore = /^\.([^.]+)$/, isInfinityOrNaN = /^-?(Infinity|NaN)$/, whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
				return function(x, str, isNum, b) {
					var base, s = isNum ? str : str.replace(whitespaceOrPlus, "");
					if (isInfinityOrNaN.test(s)) x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
					else {
						if (!isNum) {
							s = s.replace(basePrefix, function(m, p1, p2) {
								base = (p2 = p2.toLowerCase()) == "x" ? 16 : p2 == "b" ? 2 : 8;
								return !b || b == base ? p1 : m;
							});
							if (b) {
								base = b;
								s = s.replace(dotAfter, "$1").replace(dotBefore, "0.$1");
							}
							if (str != s) return new BigNumber(s, base);
						}
						if (BigNumber.DEBUG) throw Error(bignumberError + "Not a" + (b ? " base " + b : "") + " number: " + str);
						x.s = null;
					}
					x.c = x.e = null;
				};
			})();
			function round(x, sd, rm, r) {
				var d, i, j, k, n, ni, rd, xc = x.c, pows10 = POWS_TEN;
				if (xc) {
					out: {
						for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
						i = sd - d;
						if (i < 0) {
							i += LOG_BASE;
							j = sd;
							n = xc[ni = 0];
							rd = mathfloor(n / pows10[d - j - 1] % 10);
						} else {
							ni = mathceil((i + 1) / LOG_BASE);
							if (ni >= xc.length) {
								if (r) {
									for (; xc.length <= ni; xc.push(0));
									n = rd = 0;
									d = 1;
									i %= LOG_BASE;
									j = i - LOG_BASE + 1;
								} else break out;
							} else {
								n = k = xc[ni];
								for (d = 1; k >= 10; k /= 10, d++);
								i %= LOG_BASE;
								j = i - LOG_BASE + d;
								rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
							}
						}
						r = r || sd < 0 || xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
						r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 && (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
						if (sd < 1 || !xc[0]) {
							xc.length = 0;
							if (r) {
								sd -= x.e + 1;
								xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
								x.e = -sd || 0;
							} else xc[0] = x.e = 0;
							return x;
						}
						if (i == 0) {
							xc.length = ni;
							k = 1;
							ni--;
						} else {
							xc.length = ni + 1;
							k = pows10[LOG_BASE - i];
							xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
						}
						if (r) for (;;) if (ni == 0) {
							for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
							j = xc[0] += k;
							for (k = 1; j >= 10; j /= 10, k++);
							if (i != k) {
								x.e++;
								if (xc[0] == BASE) xc[0] = 1;
							}
							break;
						} else {
							xc[ni] += k;
							if (xc[ni] != BASE) break;
							xc[ni--] = 0;
							k = 1;
						}
						for (i = xc.length; xc[--i] === 0; xc.pop());
					}
					if (x.e > MAX_EXP) x.c = x.e = null;
					else if (x.e < MIN_EXP) x.c = [x.e = 0];
				}
				return x;
			}
			function valueOf(n) {
				var str, e = n.e;
				if (e === null) return n.toString();
				str = coeffToString(n.c);
				str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, "0");
				return n.s < 0 ? "-" + str : str;
			}
			P.absoluteValue = P.abs = function() {
				var x = new BigNumber(this);
				if (x.s < 0) x.s = 1;
				return x;
			};
			P.comparedTo = function(y, b) {
				return compare(this, new BigNumber(y, b));
			};
			P.decimalPlaces = P.dp = function(dp, rm) {
				var c, n, v, x = this;
				if (dp != null) {
					intCheck(dp, 0, MAX);
					if (rm == null) rm = ROUNDING_MODE;
					else intCheck(rm, 0, 8);
					return round(new BigNumber(x), dp + x.e + 1, rm);
				}
				if (!(c = x.c)) return null;
				n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;
				if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
				if (n < 0) n = 0;
				return n;
			};
			P.dividedBy = P.div = function(y, b) {
				return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
			};
			P.dividedToIntegerBy = P.idiv = function(y, b) {
				return div(this, new BigNumber(y, b), 0, 1);
			};
			P.exponentiatedBy = P.pow = function(n, m) {
				var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y, x = this;
				n = new BigNumber(n);
				if (n.c && !n.isInteger()) throw Error(bignumberError + "Exponent not an integer: " + valueOf(n));
				if (m != null) m = new BigNumber(m);
				nIsBig = n.e > 14;
				if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
					y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
					return m ? y.mod(m) : y;
				}
				nIsNeg = n.s < 0;
				if (m) {
					if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);
					isModExp = !nIsNeg && x.isInteger() && m.isInteger();
					if (isModExp) x = x.mod(m);
				} else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0 ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7 : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
					k = x.s < 0 && isOdd(n) ? -0 : 0;
					if (x.e > -1) k = 1 / k;
					return new BigNumber(nIsNeg ? 1 / k : k);
				} else if (POW_PRECISION) k = mathceil(POW_PRECISION / LOG_BASE + 2);
				if (nIsBig) {
					half = new BigNumber(.5);
					if (nIsNeg) n.s = 1;
					nIsOdd = isOdd(n);
				} else {
					i = Math.abs(+valueOf(n));
					nIsOdd = i % 2;
				}
				y = new BigNumber(ONE);
				for (;;) {
					if (nIsOdd) {
						y = y.times(x);
						if (!y.c) break;
						if (k) {
							if (y.c.length > k) y.c.length = k;
						} else if (isModExp) y = y.mod(m);
					}
					if (i) {
						i = mathfloor(i / 2);
						if (i === 0) break;
						nIsOdd = i % 2;
					} else {
						n = n.times(half);
						round(n, n.e + 1, 1);
						if (n.e > 14) nIsOdd = isOdd(n);
						else {
							i = +valueOf(n);
							if (i === 0) break;
							nIsOdd = i % 2;
						}
					}
					x = x.times(x);
					if (k) {
						if (x.c && x.c.length > k) x.c.length = k;
					} else if (isModExp) x = x.mod(m);
				}
				if (isModExp) return y;
				if (nIsNeg) y = ONE.div(y);
				return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
			};
			P.integerValue = function(rm) {
				var n = new BigNumber(this);
				if (rm == null) rm = ROUNDING_MODE;
				else intCheck(rm, 0, 8);
				return round(n, n.e + 1, rm);
			};
			P.isEqualTo = P.eq = function(y, b) {
				return compare(this, new BigNumber(y, b)) === 0;
			};
			P.isFinite = function() {
				return !!this.c;
			};
			P.isGreaterThan = P.gt = function(y, b) {
				return compare(this, new BigNumber(y, b)) > 0;
			};
			P.isGreaterThanOrEqualTo = P.gte = function(y, b) {
				return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;
			};
			P.isInteger = function() {
				return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
			};
			P.isLessThan = P.lt = function(y, b) {
				return compare(this, new BigNumber(y, b)) < 0;
			};
			P.isLessThanOrEqualTo = P.lte = function(y, b) {
				return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
			};
			P.isNaN = function() {
				return !this.s;
			};
			P.isNegative = function() {
				return this.s < 0;
			};
			P.isPositive = function() {
				return this.s > 0;
			};
			P.isZero = function() {
				return !!this.c && this.c[0] == 0;
			};
			P.minus = function(y, b) {
				var i, j, t, xLTy, x = this, a = x.s;
				y = new BigNumber(y, b);
				b = y.s;
				if (!a || !b) return new BigNumber(NaN);
				if (a != b) {
					y.s = -b;
					return x.plus(y);
				}
				var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
				if (!xe || !ye) {
					if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);
					if (!xc[0] || !yc[0]) return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x : ROUNDING_MODE == 3 ? -0 : 0);
				}
				xe = bitFloor(xe);
				ye = bitFloor(ye);
				xc = xc.slice();
				if (a = xe - ye) {
					if (xLTy = a < 0) {
						a = -a;
						t = xc;
					} else {
						ye = xe;
						t = yc;
					}
					t.reverse();
					for (b = a; b--; t.push(0));
					t.reverse();
				} else {
					j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
					for (a = b = 0; b < j; b++) if (xc[b] != yc[b]) {
						xLTy = xc[b] < yc[b];
						break;
					}
				}
				if (xLTy) {
					t = xc;
					xc = yc;
					yc = t;
					y.s = -y.s;
				}
				b = (j = yc.length) - (i = xc.length);
				if (b > 0) for (; b--; xc[i++] = 0);
				b = BASE - 1;
				for (; j > a;) {
					if (xc[--j] < yc[j]) {
						for (i = j; i && !xc[--i]; xc[i] = b);
						--xc[i];
						xc[j] += BASE;
					}
					xc[j] -= yc[j];
				}
				for (; xc[0] == 0; xc.splice(0, 1), --ye);
				if (!xc[0]) {
					y.s = ROUNDING_MODE == 3 ? -1 : 1;
					y.c = [y.e = 0];
					return y;
				}
				return normalise(y, xc, ye);
			};
			P.modulo = P.mod = function(y, b) {
				var q, s, x = this;
				y = new BigNumber(y, b);
				if (!x.c || !y.s || y.c && !y.c[0]) return new BigNumber(NaN);
				else if (!y.c || x.c && !x.c[0]) return new BigNumber(x);
				if (MODULO_MODE == 9) {
					s = y.s;
					y.s = 1;
					q = div(x, y, 0, 3);
					y.s = s;
					q.s *= s;
				} else q = div(x, y, 0, MODULO_MODE);
				y = x.minus(q.times(y));
				if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
				return y;
			};
			P.multipliedBy = P.times = function(y, b) {
				var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc, base, sqrtBase, x = this, xc = x.c, yc = (y = new BigNumber(y, b)).c;
				if (!xc || !yc || !xc[0] || !yc[0]) {
					if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) y.c = y.e = y.s = null;
					else {
						y.s *= x.s;
						if (!xc || !yc) y.c = y.e = null;
						else {
							y.c = [0];
							y.e = 0;
						}
					}
					return y;
				}
				e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
				y.s *= x.s;
				xcL = xc.length;
				ycL = yc.length;
				if (xcL < ycL) {
					zc = xc;
					xc = yc;
					yc = zc;
					i = xcL;
					xcL = ycL;
					ycL = i;
				}
				for (i = xcL + ycL, zc = []; i--; zc.push(0));
				base = BASE;
				sqrtBase = SQRT_BASE;
				for (i = ycL; --i >= 0;) {
					c = 0;
					ylo = yc[i] % sqrtBase;
					yhi = yc[i] / sqrtBase | 0;
					for (k = xcL, j = i + k; j > i;) {
						xlo = xc[--k] % sqrtBase;
						xhi = xc[k] / sqrtBase | 0;
						m = yhi * xlo + xhi * ylo;
						xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
						c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
						zc[j--] = xlo % base;
					}
					zc[j] = c;
				}
				if (c) ++e;
				else zc.splice(0, 1);
				return normalise(y, zc, e);
			};
			P.negated = function() {
				var x = new BigNumber(this);
				x.s = -x.s || null;
				return x;
			};
			P.plus = function(y, b) {
				var t, x = this, a = x.s;
				y = new BigNumber(y, b);
				b = y.s;
				if (!a || !b) return new BigNumber(NaN);
				if (a != b) {
					y.s = -b;
					return x.minus(y);
				}
				var xe = x.e / LOG_BASE, ye = y.e / LOG_BASE, xc = x.c, yc = y.c;
				if (!xe || !ye) {
					if (!xc || !yc) return new BigNumber(a / 0);
					if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
				}
				xe = bitFloor(xe);
				ye = bitFloor(ye);
				xc = xc.slice();
				if (a = xe - ye) {
					if (a > 0) {
						ye = xe;
						t = yc;
					} else {
						a = -a;
						t = xc;
					}
					t.reverse();
					for (; a--; t.push(0));
					t.reverse();
				}
				a = xc.length;
				b = yc.length;
				if (a - b < 0) {
					t = yc;
					yc = xc;
					xc = t;
					b = a;
				}
				for (a = 0; b;) {
					a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
					xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
				}
				if (a) {
					xc = [a].concat(xc);
					++ye;
				}
				return normalise(y, xc, ye);
			};
			P.precision = P.sd = function(sd, rm) {
				var c, n, v, x = this;
				if (sd != null && sd !== !!sd) {
					intCheck(sd, 1, MAX);
					if (rm == null) rm = ROUNDING_MODE;
					else intCheck(rm, 0, 8);
					return round(new BigNumber(x), sd, rm);
				}
				if (!(c = x.c)) return null;
				v = c.length - 1;
				n = v * LOG_BASE + 1;
				if (v = c[v]) {
					for (; v % 10 == 0; v /= 10, n--);
					for (v = c[0]; v >= 10; v /= 10, n++);
				}
				if (sd && x.e + 1 > n) n = x.e + 1;
				return n;
			};
			P.shiftedBy = function(k) {
				intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
				return this.times("1e" + k);
			};
			P.squareRoot = P.sqrt = function() {
				var m, n, r, rep, t, x = this, c = x.c, s = x.s, e = x.e, dp = DECIMAL_PLACES + 4, half = new BigNumber("0.5");
				if (s !== 1 || !c || !c[0]) return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
				s = Math.sqrt(+valueOf(x));
				if (s == 0 || s == 1 / 0) {
					n = coeffToString(c);
					if ((n.length + e) % 2 == 0) n += "0";
					s = Math.sqrt(+n);
					e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
					if (s == 1 / 0) n = "5e" + e;
					else {
						n = s.toExponential();
						n = n.slice(0, n.indexOf("e") + 1) + e;
					}
					r = new BigNumber(n);
				} else r = new BigNumber(s + "");
				if (r.c[0]) {
					e = r.e;
					s = e + dp;
					if (s < 3) s = 0;
					for (;;) {
						t = r;
						r = half.times(t.plus(div(x, t, dp, 1)));
						if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
							if (r.e < e) --s;
							n = n.slice(s - 3, s + 1);
							if (n == "9999" || !rep && n == "4999") {
								if (!rep) {
									round(t, t.e + DECIMAL_PLACES + 2, 0);
									if (t.times(t).eq(x)) {
										r = t;
										break;
									}
								}
								dp += 4;
								s += 4;
								rep = 1;
							} else {
								if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
									round(r, r.e + DECIMAL_PLACES + 2, 1);
									m = !r.times(r).eq(x);
								}
								break;
							}
						}
					}
				}
				return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
			};
			P.toExponential = function(dp, rm) {
				if (dp != null) {
					intCheck(dp, 0, MAX);
					dp++;
				}
				return format(this, dp, rm, 1);
			};
			P.toFixed = function(dp, rm) {
				if (dp != null) {
					intCheck(dp, 0, MAX);
					dp = dp + this.e + 1;
				}
				return format(this, dp, rm);
			};
			P.toFormat = function(dp, rm, format) {
				var str, x = this;
				if (format == null) {
					if (dp != null && rm && typeof rm == "object") {
						format = rm;
						rm = null;
					} else if (dp && typeof dp == "object") {
						format = dp;
						dp = rm = null;
					} else format = FORMAT;
				} else if (typeof format != "object") throw Error(bignumberError + "Argument not an object: " + format);
				str = x.toFixed(dp, rm);
				if (x.c) {
					var i, arr = str.split("."), g1 = +format.groupSize, g2 = +format.secondaryGroupSize, groupSeparator = format.groupSeparator || "", intPart = arr[0], fractionPart = arr[1], isNeg = x.s < 0, intDigits = isNeg ? intPart.slice(1) : intPart, len = intDigits.length;
					if (g2) {
						i = g1;
						g1 = g2;
						g2 = i;
						len -= i;
					}
					if (g1 > 0 && len > 0) {
						i = len % g1 || g1;
						intPart = intDigits.substr(0, i);
						for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
						if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
						if (isNeg) intPart = "-" + intPart;
					}
					str = fractionPart ? intPart + (format.decimalSeparator || "") + ((g2 = +format.fractionGroupSize) ? fractionPart.replace(new RegExp("\\d{" + g2 + "}\\B", "g"), "$&" + (format.fractionGroupSeparator || "")) : fractionPart) : intPart;
				}
				return (format.prefix || "") + str + (format.suffix || "");
			};
			P.toFraction = function(md) {
				var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s, x = this, xc = x.c;
				if (md != null) {
					n = new BigNumber(md);
					if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) throw Error(bignumberError + "Argument " + (n.isInteger() ? "out of range: " : "not an integer: ") + valueOf(n));
				}
				if (!xc) return new BigNumber(x);
				d = new BigNumber(ONE);
				n1 = d0 = new BigNumber(ONE);
				d1 = n0 = new BigNumber(ONE);
				s = coeffToString(xc);
				e = d.e = s.length - x.e - 1;
				d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
				md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
				exp = MAX_EXP;
				MAX_EXP = 1 / 0;
				n = new BigNumber(s);
				n0.c[0] = 0;
				for (;;) {
					q = div(n, d, 0, 1);
					d2 = d0.plus(q.times(d1));
					if (d2.comparedTo(md) == 1) break;
					d0 = d1;
					d1 = d2;
					n1 = n0.plus(q.times(d2 = n1));
					n0 = d2;
					d = n.minus(q.times(d2 = d));
					n = d2;
				}
				d2 = div(md.minus(d0), d1, 0, 1);
				n0 = n0.plus(d2.times(n1));
				d0 = d0.plus(d2.times(d1));
				n0.s = n1.s = x.s;
				e = e * 2;
				r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
				MAX_EXP = exp;
				return r;
			};
			P.toNumber = function() {
				return +valueOf(this);
			};
			P.toPrecision = function(sd, rm) {
				if (sd != null) intCheck(sd, 1, MAX);
				return format(this, sd, rm, 2);
			};
			P.toString = function(b) {
				var str, n = this, s = n.s, e = n.e;
				if (e === null) {
					if (s) {
						str = "Infinity";
						if (s < 0) str = "-" + str;
					} else str = "NaN";
				} else {
					if (b == null) str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, "0");
					else if (b === 10 && alphabetHasNormalDecimalDigits) {
						n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
						str = toFixedPoint(coeffToString(n.c), n.e, "0");
					} else {
						intCheck(b, 2, ALPHABET.length, "Base");
						str = convertBase(toFixedPoint(coeffToString(n.c), e, "0"), 10, b, s, true);
					}
					if (s < 0 && n.c[0]) str = "-" + str;
				}
				return str;
			};
			P.valueOf = P.toJSON = function() {
				return valueOf(this);
			};
			P._isBigNumber = true;
			if (configObject != null) BigNumber.set(configObject);
			return BigNumber;
		}
		function bitFloor(n) {
			var i = n | 0;
			return n > 0 || n === i ? i : i - 1;
		}
		function coeffToString(a) {
			var s, z, i = 1, j = a.length, r = a[0] + "";
			for (; i < j;) {
				s = a[i++] + "";
				z = LOG_BASE - s.length;
				for (; z--; s = "0" + s);
				r += s;
			}
			for (j = r.length; r.charCodeAt(--j) === 48;);
			return r.slice(0, j + 1 || 1);
		}
		function compare(x, y) {
			var a, b, xc = x.c, yc = y.c, i = x.s, j = y.s, k = x.e, l = y.e;
			if (!i || !j) return null;
			a = xc && !xc[0];
			b = yc && !yc[0];
			if (a || b) return a ? b ? 0 : -j : i;
			if (i != j) return i;
			a = i < 0;
			b = k == l;
			if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;
			if (!b) return k > l ^ a ? 1 : -1;
			j = (k = xc.length) < (l = yc.length) ? k : l;
			for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;
			return k == l ? 0 : k > l ^ a ? 1 : -1;
		}
		function intCheck(n, min, max, name) {
			if (n < min || n > max || n !== mathfloor(n)) throw Error(bignumberError + (name || "Argument") + (typeof n == "number" ? n < min || n > max ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(n));
		}
		function isOdd(n) {
			var k = n.c.length - 1;
			return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
		}
		function toExponential(str, e) {
			return (str.length > 1 ? str.charAt(0) + "." + str.slice(1) : str) + (e < 0 ? "e" : "e+") + e;
		}
		function toFixedPoint(str, e, z) {
			var len, zs;
			if (e < 0) {
				for (zs = z + "."; ++e; zs += z);
				str = zs + str;
			} else {
				len = str.length;
				if (++e > len) {
					for (zs = z, e -= len; --e; zs += z);
					str += zs;
				} else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
			}
			return str;
		}
		BigNumber = clone();
		BigNumber["default"] = BigNumber.BigNumber = BigNumber;
		if (typeof define == "function" && define.amd) define(function() {
			return BigNumber;
		});
		else if (typeof module != "undefined" && module.exports) module.exports = BigNumber;
		else {
			if (!globalObject) globalObject = typeof self != "undefined" && self ? self : window;
			globalObject.BigNumber = BigNumber;
		}
	})(exports);
}));
//#endregion
//#region node_modules/json-bigint/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BigNumber = require_bignumber();
	var JSON = module.exports;
	(function() {
		"use strict";
		var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
			"\b": "\\b",
			"	": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			"\"": "\\\"",
			"\\": "\\\\"
		}, rep;
		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? "\"" + string.replace(escapable, function(a) {
				var c = meta[a];
				return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + "\"" : "\"" + string + "\"";
		}
		function str(key, holder) {
			var i, k, v, length, mind = gap, partial, value = holder[key], isBigNumber = value != null && (value instanceof BigNumber || BigNumber.isBigNumber(value));
			if (value && typeof value === "object" && typeof value.toJSON === "function") value = value.toJSON(key);
			if (typeof rep === "function") value = rep.call(holder, key, value);
			switch (typeof value) {
				case "string": if (isBigNumber) return value;
				else return quote(value);
				case "number": return isFinite(value) ? String(value) : "null";
				case "boolean":
				case "null":
				case "bigint": return String(value);
				case "object":
					if (!value) return "null";
					gap += indent;
					partial = [];
					if (Object.prototype.toString.apply(value) === "[object Array]") {
						length = value.length;
						for (i = 0; i < length; i += 1) partial[i] = str(i, value) || "null";
						v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
						gap = mind;
						return v;
					}
					if (rep && typeof rep === "object") {
						length = rep.length;
						for (i = 0; i < length; i += 1) if (typeof rep[i] === "string") {
							k = rep[i];
							v = str(k, value);
							if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
						}
					} else Object.keys(value).forEach(function(k) {
						var v = str(k, value);
						if (v) partial.push(quote(k) + (gap ? ": " : ":") + v);
					});
					v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
					gap = mind;
					return v;
			}
		}
		if (typeof JSON.stringify !== "function") JSON.stringify = function(value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if (typeof space === "number") for (i = 0; i < space; i += 1) indent += " ";
			else if (typeof space === "string") indent = space;
			rep = replacer;
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) throw new Error("JSON.stringify");
			return str("", { "": value });
		};
	})();
}));
//#endregion
//#region node_modules/json-bigint/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BigNumber = null;
	var suspectProtoRx = /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/;
	var suspectConstructorRx = /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;
	var json_parse = function(options) {
		"use strict";
		var _options = {
			strict: false,
			storeAsString: false,
			alwaysParseAsBig: false,
			useNativeBigInt: false,
			protoAction: "error",
			constructorAction: "error"
		};
		if (options !== void 0 && options !== null) {
			if (options.strict === true) _options.strict = true;
			if (options.storeAsString === true) _options.storeAsString = true;
			_options.alwaysParseAsBig = options.alwaysParseAsBig === true ? options.alwaysParseAsBig : false;
			_options.useNativeBigInt = options.useNativeBigInt === true ? options.useNativeBigInt : false;
			if (typeof options.constructorAction !== "undefined") {
				if (options.constructorAction === "error" || options.constructorAction === "ignore" || options.constructorAction === "preserve") _options.constructorAction = options.constructorAction;
				else throw new Error(`Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ${options.constructorAction}`);
			}
			if (typeof options.protoAction !== "undefined") {
				if (options.protoAction === "error" || options.protoAction === "ignore" || options.protoAction === "preserve") _options.protoAction = options.protoAction;
				else throw new Error(`Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ${options.protoAction}`);
			}
		}
		var at, ch, escapee = {
			"\"": "\"",
			"\\": "\\",
			"/": "/",
			b: "\b",
			f: "\f",
			n: "\n",
			r: "\r",
			t: "	"
		}, text, error = function(m) {
			throw {
				name: "SyntaxError",
				message: m,
				at,
				text
			};
		}, next = function(c) {
			if (c && c !== ch) error("Expected '" + c + "' instead of '" + ch + "'");
			ch = text.charAt(at);
			at += 1;
			return ch;
		}, number = function() {
			var number, string = "";
			if (ch === "-") {
				string = "-";
				next("-");
			}
			while (ch >= "0" && ch <= "9") {
				string += ch;
				next();
			}
			if (ch === ".") {
				string += ".";
				while (next() && ch >= "0" && ch <= "9") string += ch;
			}
			if (ch === "e" || ch === "E") {
				string += ch;
				next();
				if (ch === "-" || ch === "+") {
					string += ch;
					next();
				}
				while (ch >= "0" && ch <= "9") {
					string += ch;
					next();
				}
			}
			number = +string;
			if (!isFinite(number)) error("Bad number");
			else {
				if (BigNumber == null) BigNumber = require_bignumber();
				if (string.length > 15) return _options.storeAsString ? string : _options.useNativeBigInt ? BigInt(string) : new BigNumber(string);
				else return !_options.alwaysParseAsBig ? number : _options.useNativeBigInt ? BigInt(number) : new BigNumber(number);
			}
		}, string = function() {
			var hex, i, string = "", uffff;
			if (ch === "\"") {
				var startAt = at;
				while (next()) {
					if (ch === "\"") {
						if (at - 1 > startAt) string += text.substring(startAt, at - 1);
						next();
						return string;
					}
					if (ch === "\\") {
						if (at - 1 > startAt) string += text.substring(startAt, at - 1);
						next();
						if (ch === "u") {
							uffff = 0;
							for (i = 0; i < 4; i += 1) {
								hex = parseInt(next(), 16);
								if (!isFinite(hex)) break;
								uffff = uffff * 16 + hex;
							}
							string += String.fromCharCode(uffff);
						} else if (typeof escapee[ch] === "string") string += escapee[ch];
						else break;
						startAt = at;
					}
				}
			}
			error("Bad string");
		}, white = function() {
			while (ch && ch <= " ") next();
		}, word = function() {
			switch (ch) {
				case "t":
					next("t");
					next("r");
					next("u");
					next("e");
					return true;
				case "f":
					next("f");
					next("a");
					next("l");
					next("s");
					next("e");
					return false;
				case "n":
					next("n");
					next("u");
					next("l");
					next("l");
					return null;
			}
			error("Unexpected '" + ch + "'");
		}, value, array = function() {
			var array = [];
			if (ch === "[") {
				next("[");
				white();
				if (ch === "]") {
					next("]");
					return array;
				}
				while (ch) {
					array.push(value());
					white();
					if (ch === "]") {
						next("]");
						return array;
					}
					next(",");
					white();
				}
			}
			error("Bad array");
		}, object = function() {
			var key, object = Object.create(null);
			if (ch === "{") {
				next("{");
				white();
				if (ch === "}") {
					next("}");
					return object;
				}
				while (ch) {
					key = string();
					white();
					next(":");
					if (_options.strict === true && Object.hasOwnProperty.call(object, key)) error("Duplicate key \"" + key + "\"");
					if (suspectProtoRx.test(key) === true) {
						if (_options.protoAction === "error") error("Object contains forbidden prototype property");
						else if (_options.protoAction === "ignore") value();
						else object[key] = value();
					} else if (suspectConstructorRx.test(key) === true) {
						if (_options.constructorAction === "error") error("Object contains forbidden constructor property");
						else if (_options.constructorAction === "ignore") value();
						else object[key] = value();
					} else object[key] = value();
					white();
					if (ch === "}") {
						next("}");
						return object;
					}
					next(",");
					white();
				}
			}
			error("Bad object");
		};
		value = function() {
			white();
			switch (ch) {
				case "{": return object();
				case "[": return array();
				case "\"": return string();
				case "-": return number();
				default: return ch >= "0" && ch <= "9" ? number() : word();
			}
		};
		return function(source, reviver) {
			var result;
			text = source + "";
			at = 0;
			ch = " ";
			result = value();
			white();
			if (ch) error("Syntax error");
			return typeof reviver === "function" ? (function walk(holder, key) {
				var v, value = holder[key];
				if (value && typeof value === "object") Object.keys(value).forEach(function(k) {
					v = walk(value, k);
					if (v !== void 0) value[k] = v;
					else delete value[k];
				});
				return reviver.call(holder, key, value);
			})({ "": result }, "") : result;
		};
	};
	module.exports = json_parse;
}));
//#endregion
//#region node_modules/json-bigint/index.js
var require_json_bigint = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var json_stringify = require_stringify().stringify;
	var json_parse = require_parse();
	module.exports = function(options) {
		return {
			parse: json_parse(options),
			stringify: json_stringify
		};
	};
	module.exports.parse = json_parse();
	module.exports.stringify = json_stringify;
}));
//#endregion
//#region node_modules/hi-base32/src/base32.js
var require_base32 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*
	* [hi-base32]{@link https://github.com/emn178/hi-base32}
	*
	* @version 0.5.0
	* @author Chen, Yi-Cyuan [emn178@gmail.com]
	* @copyright Chen, Yi-Cyuan 2015-2018
	* @license MIT
	*/
	(function() {
		"use strict";
		var root = typeof window === "object" ? window : {};
		if (!root.HI_BASE32_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node) root = global;
		var COMMON_JS = !root.HI_BASE32_NO_COMMON_JS && typeof module === "object" && module.exports;
		var AMD = typeof define === "function" && define.amd;
		var BASE32_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".split("");
		var BASE32_DECODE_CHAR = {
			"A": 0,
			"B": 1,
			"C": 2,
			"D": 3,
			"E": 4,
			"F": 5,
			"G": 6,
			"H": 7,
			"I": 8,
			"J": 9,
			"K": 10,
			"L": 11,
			"M": 12,
			"N": 13,
			"O": 14,
			"P": 15,
			"Q": 16,
			"R": 17,
			"S": 18,
			"T": 19,
			"U": 20,
			"V": 21,
			"W": 22,
			"X": 23,
			"Y": 24,
			"Z": 25,
			"2": 26,
			"3": 27,
			"4": 28,
			"5": 29,
			"6": 30,
			"7": 31
		};
		var blocks = [
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0
		];
		var throwInvalidUtf8 = function(position, partial) {
			if (partial.length > 10) partial = "..." + partial.substr(-10);
			var err = /* @__PURE__ */ new Error("Decoded data is not valid UTF-8. Maybe try base32.decode.asBytes()? Partial data after reading " + position + " bytes: " + partial + " <-");
			err.position = position;
			throw err;
		};
		var toUtf8String = function(bytes) {
			var str = "", length = bytes.length, i = 0, followingChars = 0, b, c;
			while (i < length) {
				b = bytes[i++];
				if (b <= 127) {
					str += String.fromCharCode(b);
					continue;
				} else if (b > 191 && b <= 223) {
					c = b & 31;
					followingChars = 1;
				} else if (b <= 239) {
					c = b & 15;
					followingChars = 2;
				} else if (b <= 247) {
					c = b & 7;
					followingChars = 3;
				} else throwInvalidUtf8(i, str);
				for (var j = 0; j < followingChars; ++j) {
					b = bytes[i++];
					if (b < 128 || b > 191) throwInvalidUtf8(i, str);
					c <<= 6;
					c += b & 63;
				}
				if (c >= 55296 && c <= 57343) throwInvalidUtf8(i, str);
				if (c > 1114111) throwInvalidUtf8(i, str);
				if (c <= 65535) str += String.fromCharCode(c);
				else {
					c -= 65536;
					str += String.fromCharCode((c >> 10) + 55296);
					str += String.fromCharCode((c & 1023) + 56320);
				}
			}
			return str;
		};
		var decodeAsBytes = function(base32Str) {
			if (base32Str === "") return [];
			else if (!/^[A-Z2-7=]+$/.test(base32Str)) throw new Error("Invalid base32 characters");
			base32Str = base32Str.replace(/=/g, "");
			var v1, v2, v3, v4, v5, v6, v7, v8, bytes = [], index = 0, length = base32Str.length;
			for (var i = 0, count = length >> 3 << 3; i < count;) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v6 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v7 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v8 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				bytes[index++] = (v1 << 3 | v2 >>> 2) & 255;
				bytes[index++] = (v2 << 6 | v3 << 1 | v4 >>> 4) & 255;
				bytes[index++] = (v4 << 4 | v5 >>> 1) & 255;
				bytes[index++] = (v5 << 7 | v6 << 2 | v7 >>> 3) & 255;
				bytes[index++] = (v7 << 5 | v8) & 255;
			}
			var remain = length - count;
			if (remain === 2) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				bytes[index++] = (v1 << 3 | v2 >>> 2) & 255;
			} else if (remain === 4) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				bytes[index++] = (v1 << 3 | v2 >>> 2) & 255;
				bytes[index++] = (v2 << 6 | v3 << 1 | v4 >>> 4) & 255;
			} else if (remain === 5) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				bytes[index++] = (v1 << 3 | v2 >>> 2) & 255;
				bytes[index++] = (v2 << 6 | v3 << 1 | v4 >>> 4) & 255;
				bytes[index++] = (v4 << 4 | v5 >>> 1) & 255;
			} else if (remain === 7) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v6 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v7 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				bytes[index++] = (v1 << 3 | v2 >>> 2) & 255;
				bytes[index++] = (v2 << 6 | v3 << 1 | v4 >>> 4) & 255;
				bytes[index++] = (v4 << 4 | v5 >>> 1) & 255;
				bytes[index++] = (v5 << 7 | v6 << 2 | v7 >>> 3) & 255;
			}
			return bytes;
		};
		var encodeAscii = function(str) {
			var v1, v2, v3, v4, v5, base32Str = "", length = str.length;
			for (var i = 0, count = parseInt(length / 5) * 5; i < count;) {
				v1 = str.charCodeAt(i++);
				v2 = str.charCodeAt(i++);
				v3 = str.charCodeAt(i++);
				v4 = str.charCodeAt(i++);
				v5 = str.charCodeAt(i++);
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[(v3 << 1 | v4 >>> 7) & 31] + BASE32_ENCODE_CHAR[v4 >>> 2 & 31] + BASE32_ENCODE_CHAR[(v4 << 3 | v5 >>> 5) & 31] + BASE32_ENCODE_CHAR[v5 & 31];
			}
			var remain = length - count;
			if (remain === 1) {
				v1 = str.charCodeAt(i);
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[v1 << 2 & 31] + "======";
			} else if (remain === 2) {
				v1 = str.charCodeAt(i++);
				v2 = str.charCodeAt(i);
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[v2 << 4 & 31] + "====";
			} else if (remain === 3) {
				v1 = str.charCodeAt(i++);
				v2 = str.charCodeAt(i++);
				v3 = str.charCodeAt(i);
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[v3 << 1 & 31] + "===";
			} else if (remain === 4) {
				v1 = str.charCodeAt(i++);
				v2 = str.charCodeAt(i++);
				v3 = str.charCodeAt(i++);
				v4 = str.charCodeAt(i);
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[(v3 << 1 | v4 >>> 7) & 31] + BASE32_ENCODE_CHAR[v4 >>> 2 & 31] + BASE32_ENCODE_CHAR[v4 << 3 & 31] + "=";
			}
			return base32Str;
		};
		var encodeUtf8 = function(str) {
			var v1, v2, v3, v4, v5, code, end = false, base32Str = "", index = 0, i, start = 0, bytes = 0, length = str.length;
			if (str === "") return base32Str;
			do {
				blocks[0] = blocks[5];
				blocks[1] = blocks[6];
				blocks[2] = blocks[7];
				for (i = start; index < length && i < 5; ++index) {
					code = str.charCodeAt(index);
					if (code < 128) blocks[i++] = code;
					else if (code < 2048) {
						blocks[i++] = 192 | code >> 6;
						blocks[i++] = 128 | code & 63;
					} else if (code < 55296 || code >= 57344) {
						blocks[i++] = 224 | code >> 12;
						blocks[i++] = 128 | code >> 6 & 63;
						blocks[i++] = 128 | code & 63;
					} else {
						code = 65536 + ((code & 1023) << 10 | str.charCodeAt(++index) & 1023);
						blocks[i++] = 240 | code >> 18;
						blocks[i++] = 128 | code >> 12 & 63;
						blocks[i++] = 128 | code >> 6 & 63;
						blocks[i++] = 128 | code & 63;
					}
				}
				bytes += i - start;
				start = i - 5;
				if (index === length) ++index;
				if (index > length && i < 6) end = true;
				v1 = blocks[0];
				if (i > 4) {
					v2 = blocks[1];
					v3 = blocks[2];
					v4 = blocks[3];
					v5 = blocks[4];
					base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[(v3 << 1 | v4 >>> 7) & 31] + BASE32_ENCODE_CHAR[v4 >>> 2 & 31] + BASE32_ENCODE_CHAR[(v4 << 3 | v5 >>> 5) & 31] + BASE32_ENCODE_CHAR[v5 & 31];
				} else if (i === 1) base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[v1 << 2 & 31] + "======";
				else if (i === 2) {
					v2 = blocks[1];
					base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[v2 << 4 & 31] + "====";
				} else if (i === 3) {
					v2 = blocks[1];
					v3 = blocks[2];
					base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[v3 << 1 & 31] + "===";
				} else {
					v2 = blocks[1];
					v3 = blocks[2];
					v4 = blocks[3];
					base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[(v3 << 1 | v4 >>> 7) & 31] + BASE32_ENCODE_CHAR[v4 >>> 2 & 31] + BASE32_ENCODE_CHAR[v4 << 3 & 31] + "=";
				}
			} while (!end);
			return base32Str;
		};
		var encodeBytes = function(bytes) {
			var v1, v2, v3, v4, v5, base32Str = "", length = bytes.length;
			for (var i = 0, count = parseInt(length / 5) * 5; i < count;) {
				v1 = bytes[i++];
				v2 = bytes[i++];
				v3 = bytes[i++];
				v4 = bytes[i++];
				v5 = bytes[i++];
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[(v3 << 1 | v4 >>> 7) & 31] + BASE32_ENCODE_CHAR[v4 >>> 2 & 31] + BASE32_ENCODE_CHAR[(v4 << 3 | v5 >>> 5) & 31] + BASE32_ENCODE_CHAR[v5 & 31];
			}
			var remain = length - count;
			if (remain === 1) {
				v1 = bytes[i];
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[v1 << 2 & 31] + "======";
			} else if (remain === 2) {
				v1 = bytes[i++];
				v2 = bytes[i];
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[v2 << 4 & 31] + "====";
			} else if (remain === 3) {
				v1 = bytes[i++];
				v2 = bytes[i++];
				v3 = bytes[i];
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[v3 << 1 & 31] + "===";
			} else if (remain === 4) {
				v1 = bytes[i++];
				v2 = bytes[i++];
				v3 = bytes[i++];
				v4 = bytes[i];
				base32Str += BASE32_ENCODE_CHAR[v1 >>> 3] + BASE32_ENCODE_CHAR[(v1 << 2 | v2 >>> 6) & 31] + BASE32_ENCODE_CHAR[v2 >>> 1 & 31] + BASE32_ENCODE_CHAR[(v2 << 4 | v3 >>> 4) & 31] + BASE32_ENCODE_CHAR[(v3 << 1 | v4 >>> 7) & 31] + BASE32_ENCODE_CHAR[v4 >>> 2 & 31] + BASE32_ENCODE_CHAR[v4 << 3 & 31] + "=";
			}
			return base32Str;
		};
		var encode = function(input, asciiOnly) {
			var notString = typeof input !== "string";
			if (notString && input.constructor === ArrayBuffer) input = new Uint8Array(input);
			if (notString) return encodeBytes(input);
			else if (asciiOnly) return encodeAscii(input);
			else return encodeUtf8(input);
		};
		var decode = function(base32Str, asciiOnly) {
			if (!asciiOnly) return toUtf8String(decodeAsBytes(base32Str));
			if (base32Str === "") return "";
			else if (!/^[A-Z2-7=]+$/.test(base32Str)) throw new Error("Invalid base32 characters");
			var v1, v2, v3, v4, v5, v6, v7, v8, str = "", length = base32Str.indexOf("=");
			if (length === -1) length = base32Str.length;
			for (var i = 0, count = length >> 3 << 3; i < count;) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v6 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v7 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v8 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				str += String.fromCharCode((v1 << 3 | v2 >>> 2) & 255) + String.fromCharCode((v2 << 6 | v3 << 1 | v4 >>> 4) & 255) + String.fromCharCode((v4 << 4 | v5 >>> 1) & 255) + String.fromCharCode((v5 << 7 | v6 << 2 | v7 >>> 3) & 255) + String.fromCharCode((v7 << 5 | v8) & 255);
			}
			var remain = length - count;
			if (remain === 2) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				str += String.fromCharCode((v1 << 3 | v2 >>> 2) & 255);
			} else if (remain === 4) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				str += String.fromCharCode((v1 << 3 | v2 >>> 2) & 255) + String.fromCharCode((v2 << 6 | v3 << 1 | v4 >>> 4) & 255);
			} else if (remain === 5) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				str += String.fromCharCode((v1 << 3 | v2 >>> 2) & 255) + String.fromCharCode((v2 << 6 | v3 << 1 | v4 >>> 4) & 255) + String.fromCharCode((v4 << 4 | v5 >>> 1) & 255);
			} else if (remain === 7) {
				v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v6 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				v7 = BASE32_DECODE_CHAR[base32Str.charAt(i++)];
				str += String.fromCharCode((v1 << 3 | v2 >>> 2) & 255) + String.fromCharCode((v2 << 6 | v3 << 1 | v4 >>> 4) & 255) + String.fromCharCode((v4 << 4 | v5 >>> 1) & 255) + String.fromCharCode((v5 << 7 | v6 << 2 | v7 >>> 3) & 255);
			}
			return str;
		};
		var exports$2 = {
			encode,
			decode
		};
		decode.asBytes = decodeAsBytes;
		if (COMMON_JS) module.exports = exports$2;
		else {
			root.base32 = exports$2;
			if (AMD) define(function() {
				return exports$2;
			});
		}
	})();
}));
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/utils/utf8.mjs
function utf8Count(str) {
	var strLength = str.length;
	var byteLength = 0;
	var pos = 0;
	while (pos < strLength) {
		var value = str.charCodeAt(pos++);
		if ((value & 4294967168) === 0) {
			byteLength++;
			continue;
		} else if ((value & 4294965248) === 0) byteLength += 2;
		else {
			if (value >= 55296 && value <= 56319) {
				if (pos < strLength) {
					var extra = str.charCodeAt(pos);
					if ((extra & 64512) === 56320) {
						++pos;
						value = ((value & 1023) << 10) + (extra & 1023) + 65536;
					}
				}
			}
			if ((value & 4294901760) === 0) byteLength += 3;
			else byteLength += 4;
		}
	}
	return byteLength;
}
function utf8EncodeJs(str, output, outputOffset) {
	var strLength = str.length;
	var offset = outputOffset;
	var pos = 0;
	while (pos < strLength) {
		var value = str.charCodeAt(pos++);
		if ((value & 4294967168) === 0) {
			output[offset++] = value;
			continue;
		} else if ((value & 4294965248) === 0) output[offset++] = value >> 6 & 31 | 192;
		else {
			if (value >= 55296 && value <= 56319) {
				if (pos < strLength) {
					var extra = str.charCodeAt(pos);
					if ((extra & 64512) === 56320) {
						++pos;
						value = ((value & 1023) << 10) + (extra & 1023) + 65536;
					}
				}
			}
			if ((value & 4294901760) === 0) {
				output[offset++] = value >> 12 & 15 | 224;
				output[offset++] = value >> 6 & 63 | 128;
			} else {
				output[offset++] = value >> 18 & 7 | 240;
				output[offset++] = value >> 12 & 63 | 128;
				output[offset++] = value >> 6 & 63 | 128;
			}
		}
		output[offset++] = value & 63 | 128;
	}
}
var sharedTextEncoder = new TextEncoder();
var TEXT_ENCODER_THRESHOLD = 50;
function utf8EncodeTE(str, output, outputOffset) {
	sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
}
function utf8Encode(str, output, outputOffset) {
	if (str.length > TEXT_ENCODER_THRESHOLD) utf8EncodeTE(str, output, outputOffset);
	else utf8EncodeJs(str, output, outputOffset);
}
var CHUNK_SIZE = 4096;
function utf8DecodeJs(bytes, inputOffset, byteLength) {
	var offset = inputOffset;
	var end = offset + byteLength;
	var units = [];
	var result = "";
	while (offset < end) {
		var byte1 = bytes[offset++];
		if ((byte1 & 128) === 0) units.push(byte1);
		else if ((byte1 & 224) === 192) {
			var byte2 = bytes[offset++] & 63;
			units.push((byte1 & 31) << 6 | byte2);
		} else if ((byte1 & 240) === 224) {
			var byte2 = bytes[offset++] & 63;
			var byte3 = bytes[offset++] & 63;
			units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
		} else if ((byte1 & 248) === 240) {
			var byte2 = bytes[offset++] & 63;
			var byte3 = bytes[offset++] & 63;
			var byte4 = bytes[offset++] & 63;
			var unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
			if (unit > 65535) {
				unit -= 65536;
				units.push(unit >>> 10 & 1023 | 55296);
				unit = 56320 | unit & 1023;
			}
			units.push(unit);
		} else units.push(byte1);
		if (units.length >= CHUNK_SIZE) {
			result += String.fromCharCode.apply(String, units);
			units.length = 0;
		}
	}
	if (units.length > 0) result += String.fromCharCode.apply(String, units);
	return result;
}
var sharedTextDecoder = new TextDecoder();
var TEXT_DECODER_THRESHOLD = 200;
function utf8DecodeTD(bytes, inputOffset, byteLength) {
	var stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
	return sharedTextDecoder.decode(stringBytes);
}
function utf8Decode(bytes, inputOffset, byteLength) {
	if (byteLength > TEXT_DECODER_THRESHOLD) return utf8DecodeTD(bytes, inputOffset, byteLength);
	else return utf8DecodeJs(bytes, inputOffset, byteLength);
}
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/ExtData.mjs
/**
* ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
*/
var ExtData = function() {
	function ExtData(type, data) {
		this.type = type;
		this.data = data;
	}
	return ExtData;
}();
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/DecodeError.mjs
var __extends = (function() {
	var extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
			d.__proto__ = b;
		} || function(d, b) {
			for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
		};
		return extendStatics(d, b);
	};
	return function(d, b) {
		if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
		extendStatics(d, b);
		function __() {
			this.constructor = d;
		}
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
})();
var DecodeError = function(_super) {
	__extends(DecodeError, _super);
	function DecodeError(message) {
		var _this = _super.call(this, message) || this;
		var proto = Object.create(DecodeError.prototype);
		Object.setPrototypeOf(_this, proto);
		Object.defineProperty(_this, "name", {
			configurable: true,
			enumerable: false,
			value: DecodeError.name
		});
		return _this;
	}
	return DecodeError;
}(Error);
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/utils/int.mjs
/**
* An enum of different options for decoding integers.
*/
var IntMode;
(function(IntMode) {
	/**
	* Always returns the value as a number. Be aware that there will be a loss of precision if the
	* value is outside the range of Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER.
	*/
	IntMode[IntMode["UNSAFE_NUMBER"] = 0] = "UNSAFE_NUMBER";
	/**
	* Always returns the value as a number, but throws an error if the value is outside of the range
	* of Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER.
	*/
	IntMode[IntMode["SAFE_NUMBER"] = 1] = "SAFE_NUMBER";
	/**
	* Returns all values encoded as int64/uint64 as bigints and all other integers as numbers.
	*/
	IntMode[IntMode["AS_ENCODED"] = 2] = "AS_ENCODED";
	/**
	* Returns all values inside the range of Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER as
	* numbers and all values outside that range as bigints.
	*/
	IntMode[IntMode["MIXED"] = 3] = "MIXED";
	/**
	* Always returns the value as a bigint, even if it is small enough to safely fit in a number.
	*/
	IntMode[IntMode["BIGINT"] = 4] = "BIGINT";
})(IntMode || (IntMode = {}));
var UINT32_MAX = 4294967295;
function setUint64(view, offset, value) {
	var high = value / 4294967296;
	var low = value;
	view.setUint32(offset, high);
	view.setUint32(offset + 4, low);
}
function setInt64(view, offset, value) {
	var high = Math.floor(value / 4294967296);
	var low = value;
	view.setUint32(offset, high);
	view.setUint32(offset + 4, low);
}
function getInt64(view, offset, mode) {
	if (mode === IntMode.UNSAFE_NUMBER || mode === IntMode.SAFE_NUMBER) {
		var high = view.getInt32(offset);
		var low = view.getUint32(offset + 4);
		if (mode === IntMode.SAFE_NUMBER && (high < Math.floor(Number.MIN_SAFE_INTEGER / 4294967296) || high === Math.floor(Number.MIN_SAFE_INTEGER / 4294967296) && low === 0 || high > (Number.MAX_SAFE_INTEGER - low) / 4294967296)) {
			var hexValue = "".concat(high < 0 ? "-" : "", "0x").concat(Math.abs(high).toString(16)).concat(low.toString(16).padStart(8, "0"));
			throw new Error("Mode is IntMode.SAFE_NUMBER and value is not a safe integer: ".concat(hexValue));
		}
		return high * 4294967296 + low;
	}
	var value = view.getBigInt64(offset);
	if (mode === IntMode.MIXED && value >= Number.MIN_SAFE_INTEGER && value <= Number.MAX_SAFE_INTEGER) return Number(value);
	return value;
}
function getUint64(view, offset, mode) {
	if (mode === IntMode.UNSAFE_NUMBER || mode === IntMode.SAFE_NUMBER) {
		var high = view.getUint32(offset);
		var low = view.getUint32(offset + 4);
		if (mode === IntMode.SAFE_NUMBER && high > (Number.MAX_SAFE_INTEGER - low) / 4294967296) {
			var hexValue = "0x".concat(high.toString(16)).concat(low.toString(16).padStart(8, "0"));
			throw new Error("Mode is IntMode.SAFE_NUMBER and value is not a safe integer: ".concat(hexValue));
		}
		return high * 4294967296 + low;
	}
	var value = view.getBigUint64(offset);
	if (mode === IntMode.MIXED && value <= Number.MAX_SAFE_INTEGER) return Number(value);
	return value;
}
/**
* Convert a safe integer Number (i.e. in the range Number.MIN_SAFE_INTEGER to Number.MAX_SAFE_INTEGER)
* with respect to the given IntMode. For all modes except IntMode.BIGINT, this returns the original
* Number unmodified.
*/
function convertSafeIntegerToMode(value, mode) {
	if (mode === IntMode.BIGINT) return BigInt(value);
	return Number(value);
}
var TIMESTAMP32_MAX_SEC = 4294967295;
var TIMESTAMP64_MAX_SEC = 17179869183;
function encodeTimeSpecToTimestamp(_a) {
	var sec = _a.sec, nsec = _a.nsec;
	if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
		if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
			var rv = /* @__PURE__ */ new Uint8Array(4);
			var view = new DataView(rv.buffer);
			view.setUint32(0, sec);
			return rv;
		} else {
			var secHigh = sec / 4294967296;
			var secLow = sec & 4294967295;
			var rv = /* @__PURE__ */ new Uint8Array(8);
			var view = new DataView(rv.buffer);
			view.setUint32(0, nsec << 2 | secHigh & 3);
			view.setUint32(4, secLow);
			return rv;
		}
	} else {
		var rv = /* @__PURE__ */ new Uint8Array(12);
		var view = new DataView(rv.buffer);
		view.setUint32(0, nsec);
		setInt64(view, 4, sec);
		return rv;
	}
}
function encodeDateToTimeSpec(date) {
	var msec = date.getTime();
	var sec = Math.floor(msec / 1e3);
	var nsec = (msec - sec * 1e3) * 1e6;
	var nsecInSec = Math.floor(nsec / 1e9);
	return {
		sec: sec + nsecInSec,
		nsec: nsec - nsecInSec * 1e9
	};
}
function encodeTimestampExtension(object) {
	if (object instanceof Date) return encodeTimeSpecToTimestamp(encodeDateToTimeSpec(object));
	else return null;
}
function decodeTimestampToTimeSpec(data) {
	var view = new DataView(data.buffer, data.byteOffset, data.byteLength);
	switch (data.byteLength) {
		case 4:
			var sec = view.getUint32(0);
			var nsec = 0;
			return {
				sec,
				nsec
			};
		case 8:
			var nsec30AndSecHigh2 = view.getUint32(0);
			var secLow32 = view.getUint32(4);
			var sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
			var nsec = nsec30AndSecHigh2 >>> 2;
			return {
				sec,
				nsec
			};
		case 12:
			var sec = getInt64(view, 4, IntMode.UNSAFE_NUMBER);
			var nsec = view.getUint32(0);
			return {
				sec,
				nsec
			};
		default: throw new DecodeError("Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(data.length));
	}
}
function decodeTimestampExtension(data) {
	var timeSpec = decodeTimestampToTimeSpec(data);
	return /* @__PURE__ */ new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
}
var timestampExtension = {
	type: -1,
	encode: encodeTimestampExtension,
	decode: decodeTimestampExtension
};
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/ExtensionCodec.mjs
var ExtensionCodec = function() {
	function ExtensionCodec() {
		this.builtInEncoders = [];
		this.builtInDecoders = [];
		this.encoders = [];
		this.decoders = [];
		this.register(timestampExtension);
	}
	ExtensionCodec.prototype.register = function(_a) {
		var type = _a.type, encode = _a.encode, decode = _a.decode;
		if (type >= 0) {
			this.encoders[type] = encode;
			this.decoders[type] = decode;
		} else {
			var index = 1 + type;
			this.builtInEncoders[index] = encode;
			this.builtInDecoders[index] = decode;
		}
	};
	ExtensionCodec.prototype.tryToEncode = function(object, context) {
		for (var i = 0; i < this.builtInEncoders.length; i++) {
			var encodeExt = this.builtInEncoders[i];
			if (encodeExt != null) {
				var data = encodeExt(object, context);
				if (data != null) {
					var type = -1 - i;
					return new ExtData(type, data);
				}
			}
		}
		for (var i = 0; i < this.encoders.length; i++) {
			var encodeExt = this.encoders[i];
			if (encodeExt != null) {
				var data = encodeExt(object, context);
				if (data != null) {
					var type = i;
					return new ExtData(type, data);
				}
			}
		}
		if (object instanceof ExtData) return object;
		return null;
	};
	ExtensionCodec.prototype.decode = function(data, type, context) {
		var decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
		if (decodeExt) return decodeExt(data, type, context);
		else return new ExtData(type, data);
	};
	ExtensionCodec.defaultCodec = new ExtensionCodec();
	return ExtensionCodec;
}();
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/utils/typedArrays.mjs
function ensureUint8Array(buffer) {
	if (buffer instanceof Uint8Array) return buffer;
	else if (ArrayBuffer.isView(buffer)) return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	else if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
	else return Uint8Array.from(buffer);
}
function createDataView(buffer) {
	if (buffer instanceof ArrayBuffer) return new DataView(buffer);
	var bufferView = ensureUint8Array(buffer);
	return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
}
function compareUint8Arrays(a, b) {
	var length = Math.min(a.length, b.length);
	for (var i = 0; i < length; i++) {
		var diff = a[i] - b[i];
		if (diff !== 0) return diff;
	}
	return a.length - b.length;
}
/**
* Represents a binary value that should be encoded as if it were a string.
*
* Effectively, this is a string that has already been UTF-8 encoded to a binary string. This is
* useful if you need to encode a value as a string, but that value contains invalid UTF-8 sequences;
* ideally this situation should be avoided and the value should be encoded as binary, not string,
* but this may be necessary for compatibility with non-ideal systems.
*/
var RawBinaryString = function() {
	/**
	* Create a new RawBinaryString from an ArrayBufferView.
	*/
	function RawBinaryString(rawBinaryValue) {
		this.rawBinaryValue = rawBinaryValue;
		if (!ArrayBuffer.isView(rawBinaryValue)) throw new TypeError("RawBinaryString: rawBinaryValue must be an ArrayBufferView");
	}
	return RawBinaryString;
}();
var DEFAULT_INITIAL_BUFFER_SIZE = 2048;
var Encoder = function() {
	function Encoder(options) {
		var _a, _b, _c, _d, _e, _f, _g, _h;
		this.extensionCodec = (_a = options === null || options === void 0 ? void 0 : options.extensionCodec) !== null && _a !== void 0 ? _a : ExtensionCodec.defaultCodec;
		this.context = options === null || options === void 0 ? void 0 : options.context;
		this.forceBigIntToInt64 = (_b = options === null || options === void 0 ? void 0 : options.forceBigIntToInt64) !== null && _b !== void 0 ? _b : false;
		this.maxDepth = (_c = options === null || options === void 0 ? void 0 : options.maxDepth) !== null && _c !== void 0 ? _c : 100;
		this.initialBufferSize = (_d = options === null || options === void 0 ? void 0 : options.initialBufferSize) !== null && _d !== void 0 ? _d : DEFAULT_INITIAL_BUFFER_SIZE;
		this.sortKeys = (_e = options === null || options === void 0 ? void 0 : options.sortKeys) !== null && _e !== void 0 ? _e : false;
		this.forceFloat32 = (_f = options === null || options === void 0 ? void 0 : options.forceFloat32) !== null && _f !== void 0 ? _f : false;
		this.ignoreUndefined = (_g = options === null || options === void 0 ? void 0 : options.ignoreUndefined) !== null && _g !== void 0 ? _g : false;
		this.forceIntegerToFloat = (_h = options === null || options === void 0 ? void 0 : options.forceIntegerToFloat) !== null && _h !== void 0 ? _h : false;
		this.pos = 0;
		this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
		this.bytes = new Uint8Array(this.view.buffer);
	}
	Encoder.prototype.reinitializeState = function() {
		this.pos = 0;
	};
	/**
	* This is almost equivalent to {@link Encoder#encode}, but it returns an reference of the encoder's internal buffer and thus much faster than {@link Encoder#encode}.
	*
	* @returns Encodes the object and returns a shared reference the encoder's internal buffer.
	*/
	Encoder.prototype.encodeSharedRef = function(object) {
		this.reinitializeState();
		this.doEncode(object, 1);
		return this.bytes.subarray(0, this.pos);
	};
	/**
	* @returns Encodes the object and returns a copy of the encoder's internal buffer.
	*/
	Encoder.prototype.encode = function(object) {
		this.reinitializeState();
		this.doEncode(object, 1);
		return this.bytes.slice(0, this.pos);
	};
	Encoder.prototype.doEncode = function(object, depth) {
		if (depth > this.maxDepth) throw new Error("Too deep objects in depth ".concat(depth));
		if (object == null) this.encodeNil();
		else if (typeof object === "boolean") this.encodeBoolean(object);
		else if (typeof object === "number") this.encodeNumber(object);
		else if (typeof object === "string") this.encodeString(object);
		else this.encodeObject(object, depth);
	};
	Encoder.prototype.ensureBufferSizeToWrite = function(sizeToWrite) {
		var requiredSize = this.pos + sizeToWrite;
		if (this.view.byteLength < requiredSize) this.resizeBuffer(requiredSize * 2);
	};
	Encoder.prototype.resizeBuffer = function(newSize) {
		var newBuffer = new ArrayBuffer(newSize);
		var newBytes = new Uint8Array(newBuffer);
		var newView = new DataView(newBuffer);
		newBytes.set(this.bytes);
		this.view = newView;
		this.bytes = newBytes;
	};
	Encoder.prototype.encodeNil = function() {
		this.writeU8(192);
	};
	Encoder.prototype.encodeBoolean = function(object) {
		if (object === false) this.writeU8(194);
		else this.writeU8(195);
	};
	Encoder.prototype.encodeNumber = function(object) {
		if (!this.forceIntegerToFloat && Number.isSafeInteger(object)) {
			if (object >= 0) {
				if (object < 128) this.writeU8(object);
				else if (object < 256) {
					this.writeU8(204);
					this.writeU8(object);
				} else if (object < 65536) {
					this.writeU8(205);
					this.writeU16(object);
				} else if (object < 4294967296) {
					this.writeU8(206);
					this.writeU32(object);
				} else {
					this.writeU8(207);
					this.writeU64(object);
				}
			} else if (object >= -32) this.writeU8(224 | object + 32);
			else if (object >= -128) {
				this.writeU8(208);
				this.writeI8(object);
			} else if (object >= -32768) {
				this.writeU8(209);
				this.writeI16(object);
			} else if (object >= -2147483648) {
				this.writeU8(210);
				this.writeI32(object);
			} else {
				this.writeU8(211);
				this.writeI64(object);
			}
		} else this.encodeNumberAsFloat(object);
	};
	Encoder.prototype.encodeNumberAsFloat = function(object) {
		if (this.forceFloat32) {
			this.writeU8(202);
			this.writeF32(object);
		} else {
			this.writeU8(203);
			this.writeF64(object);
		}
	};
	Encoder.prototype.encodeBigInt = function(object) {
		if (this.forceBigIntToInt64) this.encodeBigIntAsInt64(object);
		else if (object >= 0) {
			if (object < 4294967296 || this.forceIntegerToFloat) this.encodeNumber(Number(object));
			else if (object < BigInt("0x10000000000000000")) this.encodeBigIntAsInt64(object);
			else throw new Error("Bigint is too large for uint64: ".concat(object));
		} else if (object >= -2147483648 || this.forceIntegerToFloat) this.encodeNumber(Number(object));
		else if (object >= BigInt(-1) * BigInt("0x8000000000000000")) this.encodeBigIntAsInt64(object);
		else throw new Error("Bigint is too small for int64: ".concat(object));
	};
	Encoder.prototype.encodeBigIntAsInt64 = function(object) {
		if (object >= BigInt(0)) {
			this.writeU8(207);
			this.writeBigUint64(object);
		} else {
			this.writeU8(211);
			this.writeBigInt64(object);
		}
	};
	Encoder.prototype.writeStringHeader = function(byteLength) {
		if (byteLength < 32) this.writeU8(160 + byteLength);
		else if (byteLength < 256) {
			this.writeU8(217);
			this.writeU8(byteLength);
		} else if (byteLength < 65536) {
			this.writeU8(218);
			this.writeU16(byteLength);
		} else if (byteLength < 4294967296) {
			this.writeU8(219);
			this.writeU32(byteLength);
		} else throw new Error("Too long string: ".concat(byteLength, " bytes in UTF-8"));
	};
	Encoder.prototype.encodeString = function(object) {
		var maxHeaderSize = 5;
		var byteLength = utf8Count(object);
		this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
		this.writeStringHeader(byteLength);
		utf8Encode(object, this.bytes, this.pos);
		this.pos += byteLength;
	};
	Encoder.prototype.encodeObject = function(object, depth) {
		var ext = this.extensionCodec.tryToEncode(object, this.context);
		if (ext != null) this.encodeExtension(ext);
		else if (Array.isArray(object)) this.encodeArray(object, depth);
		else if (ArrayBuffer.isView(object)) this.encodeBinary(object);
		else if (object instanceof RawBinaryString) this.encodeBinaryAsString(object);
		else if (typeof object === "bigint") this.encodeBigInt(object);
		else if (object instanceof Map) this.encodeMap(object, depth);
		else if (typeof object === "object") this.encodeMapObject(object, depth);
		else throw new Error("Unrecognized object: ".concat(Object.prototype.toString.apply(object)));
	};
	Encoder.prototype.encodeBinary = function(object) {
		var size = object.byteLength;
		if (size < 256) {
			this.writeU8(196);
			this.writeU8(size);
		} else if (size < 65536) {
			this.writeU8(197);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(198);
			this.writeU32(size);
		} else throw new Error("Too large binary: ".concat(size));
		var bytes = ensureUint8Array(object);
		this.writeU8a(bytes);
	};
	Encoder.prototype.encodeBinaryAsString = function(binaryString) {
		var object = binaryString.rawBinaryValue;
		this.writeStringHeader(object.byteLength);
		var bytes = ensureUint8Array(object);
		this.writeU8a(bytes);
	};
	Encoder.prototype.encodeArray = function(object, depth) {
		var size = object.length;
		if (size < 16) this.writeU8(144 + size);
		else if (size < 65536) {
			this.writeU8(220);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(221);
			this.writeU32(size);
		} else throw new Error("Too large array: ".concat(size));
		for (var _i = 0, object_1 = object; _i < object_1.length; _i++) {
			var item = object_1[_i];
			this.doEncode(item, depth + 1);
		}
	};
	Encoder.prototype.countWithoutUndefined = function(map, keys) {
		var count = 0;
		for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
			var key = keys_1[_i];
			if (map.get(key) !== void 0) count++;
		}
		return count;
	};
	Encoder.prototype.sortMapKeys = function(keys) {
		var numericKeys = [];
		var stringKeys = [];
		var rawStringKeys = [];
		var binaryKeys = [];
		for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
			var key = keys_2[_i];
			if (typeof key === "number") {
				if (isNaN(key)) throw new Error("Cannot sort map keys with NaN value");
				numericKeys.push(key);
			} else if (typeof key === "bigint") numericKeys.push(key);
			else if (typeof key === "string") stringKeys.push(key);
			else if (ArrayBuffer.isView(key)) binaryKeys.push(ensureUint8Array(key));
			else if (key instanceof RawBinaryString) rawStringKeys.push(key);
			else throw new Error("Unsupported map key type: ".concat(Object.prototype.toString.apply(key)));
		}
		numericKeys.sort(function(a, b) {
			return a < b ? -1 : a > b ? 1 : 0;
		});
		stringKeys.sort();
		rawStringKeys.sort(function(a, b) {
			return compareUint8Arrays(ensureUint8Array(a.rawBinaryValue), ensureUint8Array(b.rawBinaryValue));
		});
		binaryKeys.sort(compareUint8Arrays);
		return [].concat(numericKeys, stringKeys, rawStringKeys, binaryKeys);
	};
	Encoder.prototype.encodeMapObject = function(object, depth) {
		this.encodeMap(new Map(Object.entries(object)), depth);
	};
	Encoder.prototype.encodeMap = function(map, depth) {
		var keys = Array.from(map.keys());
		if (this.sortKeys) keys = this.sortMapKeys(keys);
		var size = this.ignoreUndefined ? this.countWithoutUndefined(map, keys) : keys.length;
		if (size < 16) this.writeU8(128 + size);
		else if (size < 65536) {
			this.writeU8(222);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(223);
			this.writeU32(size);
		} else throw new Error("Too large map object: ".concat(size));
		for (var _i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
			var key = keys_3[_i];
			var value = map.get(key);
			if (!(this.ignoreUndefined && value === void 0)) {
				if (typeof key === "string") this.encodeString(key);
				else if (typeof key === "number") this.encodeNumber(key);
				else if (typeof key === "bigint") this.encodeBigInt(key);
				else if (ArrayBuffer.isView(key)) this.encodeBinary(key);
				else if (key instanceof RawBinaryString) this.encodeBinaryAsString(key);
				else throw new Error("Unsupported map key type: ".concat(Object.prototype.toString.apply(key)));
				this.doEncode(value, depth + 1);
			}
		}
	};
	Encoder.prototype.encodeExtension = function(ext) {
		var size = ext.data.length;
		if (size === 1) this.writeU8(212);
		else if (size === 2) this.writeU8(213);
		else if (size === 4) this.writeU8(214);
		else if (size === 8) this.writeU8(215);
		else if (size === 16) this.writeU8(216);
		else if (size < 256) {
			this.writeU8(199);
			this.writeU8(size);
		} else if (size < 65536) {
			this.writeU8(200);
			this.writeU16(size);
		} else if (size < 4294967296) {
			this.writeU8(201);
			this.writeU32(size);
		} else throw new Error("Too large extension object: ".concat(size));
		this.writeI8(ext.type);
		this.writeU8a(ext.data);
	};
	Encoder.prototype.writeU8 = function(value) {
		this.ensureBufferSizeToWrite(1);
		this.view.setUint8(this.pos, value);
		this.pos++;
	};
	Encoder.prototype.writeU8a = function(values) {
		var size = values.length;
		this.ensureBufferSizeToWrite(size);
		this.bytes.set(values, this.pos);
		this.pos += size;
	};
	Encoder.prototype.writeI8 = function(value) {
		this.ensureBufferSizeToWrite(1);
		this.view.setInt8(this.pos, value);
		this.pos++;
	};
	Encoder.prototype.writeU16 = function(value) {
		this.ensureBufferSizeToWrite(2);
		this.view.setUint16(this.pos, value);
		this.pos += 2;
	};
	Encoder.prototype.writeI16 = function(value) {
		this.ensureBufferSizeToWrite(2);
		this.view.setInt16(this.pos, value);
		this.pos += 2;
	};
	Encoder.prototype.writeU32 = function(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setUint32(this.pos, value);
		this.pos += 4;
	};
	Encoder.prototype.writeI32 = function(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setInt32(this.pos, value);
		this.pos += 4;
	};
	Encoder.prototype.writeF32 = function(value) {
		this.ensureBufferSizeToWrite(4);
		this.view.setFloat32(this.pos, value);
		this.pos += 4;
	};
	Encoder.prototype.writeF64 = function(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setFloat64(this.pos, value);
		this.pos += 8;
	};
	Encoder.prototype.writeU64 = function(value) {
		this.ensureBufferSizeToWrite(8);
		setUint64(this.view, this.pos, value);
		this.pos += 8;
	};
	Encoder.prototype.writeI64 = function(value) {
		this.ensureBufferSizeToWrite(8);
		setInt64(this.view, this.pos, value);
		this.pos += 8;
	};
	Encoder.prototype.writeBigUint64 = function(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setBigUint64(this.pos, value);
		this.pos += 8;
	};
	Encoder.prototype.writeBigInt64 = function(value) {
		this.ensureBufferSizeToWrite(8);
		this.view.setBigInt64(this.pos, value);
		this.pos += 8;
	};
	return Encoder;
}();
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/encode.mjs
/**
* It encodes `value` in the MessagePack format and
* returns a byte buffer.
*
* The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
*/
function encode(value, options) {
	return new Encoder(options).encodeSharedRef(value);
}
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/utils/prettyByte.mjs
function prettyByte(byte) {
	return "".concat(byte < 0 ? "-" : "", "0x").concat(Math.abs(byte).toString(16).padStart(2, "0"));
}
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/CachedKeyDecoder.mjs
var DEFAULT_MAX_KEY_LENGTH = 16;
var DEFAULT_MAX_LENGTH_PER_KEY = 16;
var CachedKeyDecoder = function() {
	function CachedKeyDecoder(maxKeyLength, maxLengthPerKey) {
		if (maxKeyLength === void 0) maxKeyLength = DEFAULT_MAX_KEY_LENGTH;
		if (maxLengthPerKey === void 0) maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY;
		this.maxKeyLength = maxKeyLength;
		this.maxLengthPerKey = maxLengthPerKey;
		this.hit = 0;
		this.miss = 0;
		this.caches = [];
		for (var i = 0; i < this.maxKeyLength; i++) this.caches.push([]);
	}
	CachedKeyDecoder.prototype.canBeCached = function(byteLength) {
		return byteLength > 0 && byteLength <= this.maxKeyLength;
	};
	CachedKeyDecoder.prototype.find = function(bytes, inputOffset, byteLength) {
		var records = this.caches[byteLength - 1];
		FIND_CHUNK: for (var _i = 0, records_1 = records; _i < records_1.length; _i++) {
			var record = records_1[_i];
			var recordBytes = record.bytes;
			for (var j = 0; j < byteLength; j++) if (recordBytes[j] !== bytes[inputOffset + j]) continue FIND_CHUNK;
			return record.str;
		}
		return null;
	};
	CachedKeyDecoder.prototype.store = function(bytes, value) {
		var records = this.caches[bytes.length - 1];
		var record = {
			bytes,
			str: value
		};
		if (records.length >= this.maxLengthPerKey) records[Math.random() * records.length | 0] = record;
		else records.push(record);
	};
	CachedKeyDecoder.prototype.decode = function(bytes, inputOffset, byteLength) {
		var cachedValue = this.find(bytes, inputOffset, byteLength);
		if (cachedValue != null) {
			this.hit++;
			return cachedValue;
		}
		this.miss++;
		var str = utf8DecodeJs(bytes, inputOffset, byteLength);
		var slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
		this.store(slicedCopyOfBytes, str);
		return str;
	};
	return CachedKeyDecoder;
}();
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/Decoder.mjs
var __awaiter = function(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
var __generator = function(thisArg, body) {
	var _ = {
		label: 0,
		sent: function() {
			if (t[0] & 1) throw t[1];
			return t[1];
		},
		trys: [],
		ops: []
	}, f, y, t, g;
	return g = {
		next: verb(0),
		"throw": verb(1),
		"return": verb(2)
	}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
		return this;
	}), g;
	function verb(n) {
		return function(v) {
			return step([n, v]);
		};
	}
	function step(op) {
		if (f) throw new TypeError("Generator is already executing.");
		while (g && (g = 0, op[0] && (_ = 0)), _) try {
			if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
			if (y = 0, t) op = [op[0] & 2, t.value];
			switch (op[0]) {
				case 0:
				case 1:
					t = op;
					break;
				case 4:
					_.label++;
					return {
						value: op[1],
						done: false
					};
				case 5:
					_.label++;
					y = op[1];
					op = [0];
					continue;
				case 7:
					op = _.ops.pop();
					_.trys.pop();
					continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
						_ = 0;
						continue;
					}
					if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
						_.label = op[1];
						break;
					}
					if (op[0] === 6 && _.label < t[1]) {
						_.label = t[1];
						t = op;
						break;
					}
					if (t && _.label < t[2]) {
						_.label = t[2];
						_.ops.push(op);
						break;
					}
					if (t[2]) _.ops.pop();
					_.trys.pop();
					continue;
			}
			op = body.call(thisArg, _);
		} catch (e) {
			op = [6, e];
			y = 0;
		} finally {
			f = t = 0;
		}
		if (op[0] & 5) throw op[1];
		return {
			value: op[0] ? op[1] : void 0,
			done: true
		};
	}
};
var __asyncValues = function(o) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var m = o[Symbol.asyncIterator], i;
	return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i);
	function verb(n) {
		i[n] = o[n] && function(v) {
			return new Promise(function(resolve, reject) {
				v = o[n](v), settle(resolve, reject, v.done, v.value);
			});
		};
	}
	function settle(resolve, reject, d, v) {
		Promise.resolve(v).then(function(v) {
			resolve({
				value: v,
				done: d
			});
		}, reject);
	}
};
var __await = function(v) {
	return this instanceof __await ? (this.v = v, this) : new __await(v);
};
var __asyncGenerator = function(thisArg, _arguments, generator) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var g = generator.apply(thisArg, _arguments || []), i, q = [];
	return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function verb(n) {
		if (g[n]) i[n] = function(v) {
			return new Promise(function(a, b) {
				q.push([
					n,
					v,
					a,
					b
				]) > 1 || resume(n, v);
			});
		};
	}
	function resume(n, v) {
		try {
			step(g[n](v));
		} catch (e) {
			settle(q[0][3], e);
		}
	}
	function step(r) {
		r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
	}
	function fulfill(value) {
		resume("next", value);
	}
	function reject(value) {
		resume("throw", value);
	}
	function settle(f, v) {
		if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
	}
};
var STATE_ARRAY = "array";
var STATE_MAP_KEY = "map_key";
var STATE_MAP_VALUE = "map_value";
function isValidMapKeyType(key, useMap, supportObjectNumberKeys) {
	if (useMap) return typeof key === "string" || typeof key === "number" || typeof key === "bigint" || key instanceof Uint8Array || key instanceof RawBinaryString;
	return typeof key === "string" || supportObjectNumberKeys && typeof key === "number";
}
var StackPool = function() {
	function StackPool(useMap) {
		this.useMap = useMap;
		this.stack = [];
		this.stackHeadPosition = -1;
	}
	Object.defineProperty(StackPool.prototype, "length", {
		get: function() {
			return this.stackHeadPosition + 1;
		},
		enumerable: false,
		configurable: true
	});
	StackPool.prototype.top = function() {
		return this.stack[this.stackHeadPosition];
	};
	StackPool.prototype.pushArrayState = function(size) {
		var state = this.getUninitializedStateFromPool();
		state.type = STATE_ARRAY;
		state.position = 0;
		state.size = size;
		state.array = new Array(size);
	};
	StackPool.prototype.pushMapState = function(size) {
		var state = this.getUninitializedStateFromPool();
		state.type = STATE_MAP_KEY;
		state.readCount = 0;
		state.size = size;
		state.map = this.useMap ? /* @__PURE__ */ new Map() : {};
	};
	StackPool.prototype.getUninitializedStateFromPool = function() {
		this.stackHeadPosition++;
		if (this.stackHeadPosition === this.stack.length) this.stack.push({
			type: void 0,
			size: 0,
			array: void 0,
			position: 0,
			readCount: 0,
			map: void 0,
			key: null
		});
		return this.stack[this.stackHeadPosition];
	};
	StackPool.prototype.release = function(state) {
		if (this.stack[this.stackHeadPosition] !== state) throw new Error("Invalid stack state. Released state is not on top of the stack.");
		if (state.type === STATE_ARRAY) {
			var partialState = state;
			partialState.size = 0;
			partialState.array = void 0;
			partialState.position = 0;
			partialState.type = void 0;
		}
		if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
			var partialState = state;
			partialState.size = 0;
			partialState.map = void 0;
			partialState.readCount = 0;
			partialState.type = void 0;
		}
		this.stackHeadPosition--;
	};
	StackPool.prototype.reset = function() {
		this.stack.length = 0;
		this.stackHeadPosition = -1;
	};
	return StackPool;
}();
var HEAD_BYTE_REQUIRED = -1;
var EMPTY_VIEW = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0));
var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
try {
	EMPTY_VIEW.getInt8(0);
} catch (e) {
	if (!(e instanceof RangeError)) throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
}
var DataViewIndexOutOfBoundsError = RangeError;
var MORE_DATA = new DataViewIndexOutOfBoundsError("Insufficient data");
var sharedCachedKeyDecoder = new CachedKeyDecoder();
var Decoder = function() {
	function Decoder(options) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
		this.totalPos = 0;
		this.pos = 0;
		this.view = EMPTY_VIEW;
		this.bytes = EMPTY_BYTES;
		this.headByte = HEAD_BYTE_REQUIRED;
		this.extensionCodec = (_a = options === null || options === void 0 ? void 0 : options.extensionCodec) !== null && _a !== void 0 ? _a : ExtensionCodec.defaultCodec;
		this.context = options === null || options === void 0 ? void 0 : options.context;
		this.intMode = (_b = options === null || options === void 0 ? void 0 : options.intMode) !== null && _b !== void 0 ? _b : (options === null || options === void 0 ? void 0 : options.useBigInt64) ? IntMode.AS_ENCODED : IntMode.UNSAFE_NUMBER;
		this.rawBinaryStringValues = (_c = options === null || options === void 0 ? void 0 : options.rawBinaryStringValues) !== null && _c !== void 0 ? _c : false;
		this.rawBinaryStringKeys = (_d = options === null || options === void 0 ? void 0 : options.rawBinaryStringKeys) !== null && _d !== void 0 ? _d : false;
		this.useRawBinaryStringClass = (_e = options === null || options === void 0 ? void 0 : options.useRawBinaryStringClass) !== null && _e !== void 0 ? _e : false;
		this.useMap = (_f = options === null || options === void 0 ? void 0 : options.useMap) !== null && _f !== void 0 ? _f : false;
		this.supportObjectNumberKeys = (_g = options === null || options === void 0 ? void 0 : options.supportObjectNumberKeys) !== null && _g !== void 0 ? _g : false;
		this.maxStrLength = (_h = options === null || options === void 0 ? void 0 : options.maxStrLength) !== null && _h !== void 0 ? _h : UINT32_MAX;
		this.maxBinLength = (_j = options === null || options === void 0 ? void 0 : options.maxBinLength) !== null && _j !== void 0 ? _j : UINT32_MAX;
		this.maxArrayLength = (_k = options === null || options === void 0 ? void 0 : options.maxArrayLength) !== null && _k !== void 0 ? _k : UINT32_MAX;
		this.maxMapLength = (_l = options === null || options === void 0 ? void 0 : options.maxMapLength) !== null && _l !== void 0 ? _l : UINT32_MAX;
		this.maxExtLength = (_m = options === null || options === void 0 ? void 0 : options.maxExtLength) !== null && _m !== void 0 ? _m : UINT32_MAX;
		this.keyDecoder = (options === null || options === void 0 ? void 0 : options.keyDecoder) !== void 0 ? options.keyDecoder : sharedCachedKeyDecoder;
		if (this.rawBinaryStringKeys && !this.useMap) throw new Error("rawBinaryStringKeys is only supported when useMap is true");
		this.stack = new StackPool(this.useMap);
	}
	Decoder.prototype.reinitializeState = function() {
		this.totalPos = 0;
		this.headByte = HEAD_BYTE_REQUIRED;
		this.stack.reset();
	};
	Decoder.prototype.setBuffer = function(buffer) {
		this.bytes = ensureUint8Array(buffer);
		this.view = createDataView(this.bytes);
		this.pos = 0;
	};
	Decoder.prototype.appendBuffer = function(buffer) {
		if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) this.setBuffer(buffer);
		else {
			var remainingData = this.bytes.subarray(this.pos);
			var newData = ensureUint8Array(buffer);
			var newBuffer = new Uint8Array(remainingData.length + newData.length);
			newBuffer.set(remainingData);
			newBuffer.set(newData, remainingData.length);
			this.setBuffer(newBuffer);
		}
	};
	Decoder.prototype.hasRemaining = function(size) {
		return this.view.byteLength - this.pos >= size;
	};
	Decoder.prototype.createExtraByteError = function(posToShow) {
		var _a = this, view = _a.view, pos = _a.pos;
		return new RangeError("Extra ".concat(view.byteLength - pos, " of ").concat(view.byteLength, " byte(s) found at buffer[").concat(posToShow, "]"));
	};
	/**
	* @throws {@link DecodeError}
	* @throws {@link RangeError}
	*/
	Decoder.prototype.decode = function(buffer) {
		this.reinitializeState();
		this.setBuffer(buffer);
		var object = this.doDecodeSync();
		if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
		return object;
	};
	Decoder.prototype.decodeMulti = function(buffer) {
		return __generator(this, function(_a) {
			switch (_a.label) {
				case 0:
					this.reinitializeState();
					this.setBuffer(buffer);
					_a.label = 1;
				case 1:
					if (!this.hasRemaining(1)) return [3, 3];
					return [4, this.doDecodeSync()];
				case 2:
					_a.sent();
					return [3, 1];
				case 3: return [2];
			}
		});
	};
	Decoder.prototype.decodeAsync = function(stream) {
		var _a, stream_1, stream_1_1;
		var _b, e_1, _c, _d;
		return __awaiter(this, void 0, void 0, function() {
			var decoded, object, buffer, e_1_1, _e, headByte, pos, totalPos;
			return __generator(this, function(_f) {
				switch (_f.label) {
					case 0:
						decoded = false;
						_f.label = 1;
					case 1:
						_f.trys.push([
							1,
							6,
							7,
							12
						]);
						_a = true, stream_1 = __asyncValues(stream);
						_f.label = 2;
					case 2: return [4, stream_1.next()];
					case 3:
						if (!(stream_1_1 = _f.sent(), _b = stream_1_1.done, !_b)) return [3, 5];
						_d = stream_1_1.value;
						_a = false;
						buffer = _d;
						if (decoded) throw this.createExtraByteError(this.totalPos);
						this.appendBuffer(buffer);
						try {
							object = this.doDecodeSync();
							decoded = true;
						} catch (e) {
							if (!(e instanceof DataViewIndexOutOfBoundsError)) throw e;
						}
						this.totalPos += this.pos;
						_f.label = 4;
					case 4:
						_a = true;
						return [3, 2];
					case 5: return [3, 12];
					case 6:
						e_1_1 = _f.sent();
						e_1 = { error: e_1_1 };
						return [3, 12];
					case 7:
						_f.trys.push([
							7,
							,
							10,
							11
						]);
						if (!(!_a && !_b && (_c = stream_1.return))) return [3, 9];
						return [4, _c.call(stream_1)];
					case 8:
						_f.sent();
						_f.label = 9;
					case 9: return [3, 11];
					case 10:
						if (e_1) throw e_1.error;
						return [7];
					case 11: return [7];
					case 12:
						if (decoded) {
							if (this.hasRemaining(1)) throw this.createExtraByteError(this.totalPos);
							return [2, object];
						}
						_e = this, headByte = _e.headByte, pos = _e.pos, totalPos = _e.totalPos;
						throw new RangeError("Insufficient data in parsing ".concat(prettyByte(headByte), " at ").concat(totalPos, " (").concat(pos, " in the current buffer)"));
				}
			});
		});
	};
	Decoder.prototype.decodeArrayStream = function(stream) {
		return this.decodeMultiAsync(stream, true);
	};
	Decoder.prototype.decodeStream = function(stream) {
		return this.decodeMultiAsync(stream, false);
	};
	Decoder.prototype.decodeMultiAsync = function(stream, isArray) {
		return __asyncGenerator(this, arguments, function decodeMultiAsync_1() {
			var isArrayHeaderRequired, arrayItemsLeft, _a, stream_2, stream_2_1, buffer, e_2, e_3_1;
			var _b, e_3, _c, _d;
			return __generator(this, function(_e) {
				switch (_e.label) {
					case 0:
						isArrayHeaderRequired = isArray;
						arrayItemsLeft = -1;
						_e.label = 1;
					case 1:
						_e.trys.push([
							1,
							13,
							14,
							19
						]);
						_a = true, stream_2 = __asyncValues(stream);
						_e.label = 2;
					case 2: return [4, __await(stream_2.next())];
					case 3:
						if (!(stream_2_1 = _e.sent(), _b = stream_2_1.done, !_b)) return [3, 12];
						_d = stream_2_1.value;
						_a = false;
						buffer = _d;
						if (isArray && arrayItemsLeft === 0) throw this.createExtraByteError(this.totalPos);
						this.appendBuffer(buffer);
						if (isArrayHeaderRequired) {
							arrayItemsLeft = this.readArraySize();
							isArrayHeaderRequired = false;
							this.complete();
						}
						_e.label = 4;
					case 4:
						_e.trys.push([
							4,
							9,
							,
							10
						]);
						_e.label = 5;
					case 5: return [4, __await(this.doDecodeSync())];
					case 6: return [4, _e.sent()];
					case 7:
						_e.sent();
						if (--arrayItemsLeft === 0) return [3, 8];
						return [3, 5];
					case 8: return [3, 10];
					case 9:
						e_2 = _e.sent();
						if (!(e_2 instanceof DataViewIndexOutOfBoundsError)) throw e_2;
						return [3, 10];
					case 10:
						this.totalPos += this.pos;
						_e.label = 11;
					case 11:
						_a = true;
						return [3, 2];
					case 12: return [3, 19];
					case 13:
						e_3_1 = _e.sent();
						e_3 = { error: e_3_1 };
						return [3, 19];
					case 14:
						_e.trys.push([
							14,
							,
							17,
							18
						]);
						if (!(!_a && !_b && (_c = stream_2.return))) return [3, 16];
						return [4, __await(_c.call(stream_2))];
					case 15:
						_e.sent();
						_e.label = 16;
					case 16: return [3, 18];
					case 17:
						if (e_3) throw e_3.error;
						return [7];
					case 18: return [7];
					case 19: return [2];
				}
			});
		});
	};
	Decoder.prototype.doDecodeSync = function() {
		DECODE: while (true) {
			var headByte = this.readHeadByte();
			var object = void 0;
			if (headByte >= 224) object = this.convertNumber(headByte - 256);
			else if (headByte < 192) {
				if (headByte < 128) object = this.convertNumber(headByte);
				else if (headByte < 144) {
					var size = headByte - 128;
					if (size !== 0) {
						this.pushMapState(size);
						this.complete();
						continue DECODE;
					} else object = this.useMap ? /* @__PURE__ */ new Map() : {};
				} else if (headByte < 160) {
					var size = headByte - 144;
					if (size !== 0) {
						this.pushArrayState(size);
						this.complete();
						continue DECODE;
					} else object = [];
				} else {
					var byteLength = headByte - 160;
					object = this.decodeString(byteLength, 0);
				}
			} else if (headByte === 192) object = null;
			else if (headByte === 194) object = false;
			else if (headByte === 195) object = true;
			else if (headByte === 202) object = this.readF32();
			else if (headByte === 203) object = this.readF64();
			else if (headByte === 204) object = this.convertNumber(this.readU8());
			else if (headByte === 205) object = this.convertNumber(this.readU16());
			else if (headByte === 206) object = this.convertNumber(this.readU32());
			else if (headByte === 207) object = this.readU64();
			else if (headByte === 208) object = this.convertNumber(this.readI8());
			else if (headByte === 209) object = this.convertNumber(this.readI16());
			else if (headByte === 210) object = this.convertNumber(this.readI32());
			else if (headByte === 211) object = this.readI64();
			else if (headByte === 217) {
				var byteLength = this.lookU8();
				object = this.decodeString(byteLength, 1);
			} else if (headByte === 218) {
				var byteLength = this.lookU16();
				object = this.decodeString(byteLength, 2);
			} else if (headByte === 219) {
				var byteLength = this.lookU32();
				object = this.decodeString(byteLength, 4);
			} else if (headByte === 220) {
				var size = this.readU16();
				if (size !== 0) {
					this.pushArrayState(size);
					this.complete();
					continue DECODE;
				} else object = [];
			} else if (headByte === 221) {
				var size = this.readU32();
				if (size !== 0) {
					this.pushArrayState(size);
					this.complete();
					continue DECODE;
				} else object = [];
			} else if (headByte === 222) {
				var size = this.readU16();
				if (size !== 0) {
					this.pushMapState(size);
					this.complete();
					continue DECODE;
				} else object = {};
			} else if (headByte === 223) {
				var size = this.readU32();
				if (size !== 0) {
					this.pushMapState(size);
					this.complete();
					continue DECODE;
				} else object = {};
			} else if (headByte === 196) {
				var size = this.lookU8();
				object = this.decodeBinary(size, 1);
			} else if (headByte === 197) {
				var size = this.lookU16();
				object = this.decodeBinary(size, 2);
			} else if (headByte === 198) {
				var size = this.lookU32();
				object = this.decodeBinary(size, 4);
			} else if (headByte === 212) object = this.decodeExtension(1, 0);
			else if (headByte === 213) object = this.decodeExtension(2, 0);
			else if (headByte === 214) object = this.decodeExtension(4, 0);
			else if (headByte === 215) object = this.decodeExtension(8, 0);
			else if (headByte === 216) object = this.decodeExtension(16, 0);
			else if (headByte === 199) {
				var size = this.lookU8();
				object = this.decodeExtension(size, 1);
			} else if (headByte === 200) {
				var size = this.lookU16();
				object = this.decodeExtension(size, 2);
			} else if (headByte === 201) {
				var size = this.lookU32();
				object = this.decodeExtension(size, 4);
			} else throw new DecodeError("Unrecognized type byte: ".concat(prettyByte(headByte)));
			this.complete();
			var stack = this.stack;
			while (stack.length > 0) {
				var state = stack.top();
				if (state.type === STATE_ARRAY) {
					state.array[state.position] = object;
					state.position++;
					if (state.position === state.size) {
						object = state.array;
						stack.release(state);
					} else continue DECODE;
				} else if (state.type === STATE_MAP_KEY) {
					if (!isValidMapKeyType(object, this.useMap, this.supportObjectNumberKeys)) {
						var acceptableTypes = this.useMap ? "string, number, bigint, or Uint8Array" : this.supportObjectNumberKeys ? "string or number" : "string";
						throw new DecodeError("The type of key must be ".concat(acceptableTypes, " but got ").concat(typeof object));
					}
					if (!this.useMap && object === "__proto__") throw new DecodeError("The key __proto__ is not allowed");
					state.key = object;
					state.type = STATE_MAP_VALUE;
					continue DECODE;
				} else {
					if (this.useMap) state.map.set(state.key, object);
					else state.map[state.key] = object;
					state.readCount++;
					if (state.readCount === state.size) {
						object = state.map;
						stack.release(state);
					} else {
						state.key = null;
						state.type = STATE_MAP_KEY;
						continue DECODE;
					}
				}
			}
			return object;
		}
	};
	Decoder.prototype.readHeadByte = function() {
		if (this.headByte === HEAD_BYTE_REQUIRED) this.headByte = this.readU8();
		return this.headByte;
	};
	Decoder.prototype.complete = function() {
		this.headByte = HEAD_BYTE_REQUIRED;
	};
	Decoder.prototype.readArraySize = function() {
		var headByte = this.readHeadByte();
		switch (headByte) {
			case 220: return this.readU16();
			case 221: return this.readU32();
			default: if (headByte < 160) return headByte - 144;
			else throw new DecodeError("Unrecognized array type byte: ".concat(prettyByte(headByte)));
		}
	};
	Decoder.prototype.pushMapState = function(size) {
		if (size > this.maxMapLength) throw new DecodeError("Max length exceeded: map length (".concat(size, ") > maxMapLengthLength (").concat(this.maxMapLength, ")"));
		this.stack.pushMapState(size);
	};
	Decoder.prototype.pushArrayState = function(size) {
		if (size > this.maxArrayLength) throw new DecodeError("Max length exceeded: array length (".concat(size, ") > maxArrayLength (").concat(this.maxArrayLength, ")"));
		this.stack.pushArrayState(size);
	};
	Decoder.prototype.decodeString = function(byteLength, headerOffset) {
		if (this.stateIsMapKey() ? this.rawBinaryStringKeys : this.rawBinaryStringValues) {
			var decoded = this.decodeBinary(byteLength, headerOffset);
			if (this.useRawBinaryStringClass) return new RawBinaryString(decoded);
			return decoded;
		}
		return this.decodeUtf8String(byteLength, headerOffset);
	};
	Decoder.prototype.decodeUtf8String = function(byteLength, headerOffset) {
		var _a;
		if (byteLength > this.maxStrLength) throw new DecodeError("Max length exceeded: UTF-8 byte length (".concat(byteLength, ") > maxStrLength (").concat(this.maxStrLength, ")"));
		if (this.bytes.byteLength < this.pos + headerOffset + byteLength) throw MORE_DATA;
		var offset = this.pos + headerOffset;
		var object;
		if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) object = this.keyDecoder.decode(this.bytes, offset, byteLength);
		else object = utf8Decode(this.bytes, offset, byteLength);
		this.pos += headerOffset + byteLength;
		return object;
	};
	Decoder.prototype.stateIsMapKey = function() {
		if (this.stack.length > 0) return this.stack.top().type === STATE_MAP_KEY;
		return false;
	};
	Decoder.prototype.decodeBinary = function(byteLength, headOffset) {
		if (byteLength > this.maxBinLength) throw new DecodeError("Max length exceeded: bin length (".concat(byteLength, ") > maxBinLength (").concat(this.maxBinLength, ")"));
		if (!this.hasRemaining(byteLength + headOffset)) throw MORE_DATA;
		var offset = this.pos + headOffset;
		var object = this.bytes.subarray(offset, offset + byteLength);
		this.pos += headOffset + byteLength;
		return object;
	};
	Decoder.prototype.decodeExtension = function(size, headOffset) {
		if (size > this.maxExtLength) throw new DecodeError("Max length exceeded: ext length (".concat(size, ") > maxExtLength (").concat(this.maxExtLength, ")"));
		var extType = this.view.getInt8(this.pos + headOffset);
		var data = this.decodeBinary(size, headOffset + 1);
		return this.extensionCodec.decode(data, extType, this.context);
	};
	Decoder.prototype.convertNumber = function(value) {
		return convertSafeIntegerToMode(value, this.intMode);
	};
	Decoder.prototype.lookU8 = function() {
		return this.view.getUint8(this.pos);
	};
	Decoder.prototype.lookU16 = function() {
		return this.view.getUint16(this.pos);
	};
	Decoder.prototype.lookU32 = function() {
		return this.view.getUint32(this.pos);
	};
	Decoder.prototype.readU8 = function() {
		var value = this.view.getUint8(this.pos);
		this.pos++;
		return value;
	};
	Decoder.prototype.readI8 = function() {
		var value = this.view.getInt8(this.pos);
		this.pos++;
		return value;
	};
	Decoder.prototype.readU16 = function() {
		var value = this.view.getUint16(this.pos);
		this.pos += 2;
		return value;
	};
	Decoder.prototype.readI16 = function() {
		var value = this.view.getInt16(this.pos);
		this.pos += 2;
		return value;
	};
	Decoder.prototype.readU32 = function() {
		var value = this.view.getUint32(this.pos);
		this.pos += 4;
		return value;
	};
	Decoder.prototype.readI32 = function() {
		var value = this.view.getInt32(this.pos);
		this.pos += 4;
		return value;
	};
	Decoder.prototype.readU64 = function() {
		var value = getUint64(this.view, this.pos, this.intMode);
		this.pos += 8;
		return value;
	};
	Decoder.prototype.readI64 = function() {
		var value = getInt64(this.view, this.pos, this.intMode);
		this.pos += 8;
		return value;
	};
	Decoder.prototype.readF32 = function() {
		var value = this.view.getFloat32(this.pos);
		this.pos += 4;
		return value;
	};
	Decoder.prototype.readF64 = function() {
		var value = this.view.getFloat64(this.pos);
		this.pos += 8;
		return value;
	};
	return Decoder;
}();
//#endregion
//#region node_modules/algorand-msgpack/dist.es5+esm/decode.mjs
/**
* It decodes a single MessagePack object in a buffer.
*
* This is a synchronous decoding function.
* See other variants for asynchronous decoding: {@link decodeAsync}, {@link decodeStream}, or {@link decodeArrayStream}.
*
* @throws {@link RangeError} if the buffer is incomplete, including the case where the buffer is empty.
* @throws {@link DecodeError} if the buffer contains invalid data.
*/
function decode$1(buffer, options) {
	return new Decoder(options).decode(buffer);
}
//#endregion
//#region node_modules/vlq/src/index.js
var import_json_bigint = /* @__PURE__ */ __toESM(require_json_bigint(), 1);
var import_base32 = /* @__PURE__ */ __toESM(require_base32(), 1);
/** @type {Record<string, number>} */
var char_to_integer = {};
/** @type {Record<number, string>} */
var integer_to_char = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split("").forEach(function(char, i) {
	char_to_integer[char] = i;
	integer_to_char[i] = char;
});
/** @param {string} string */
function decode(string) {
	/** @type {number[]} */
	let result = [];
	let shift = 0;
	let value = 0;
	for (let i = 0; i < string.length; i += 1) {
		let integer = char_to_integer[string[i]];
		if (integer === void 0) throw new Error("Invalid character (" + string[i] + ")");
		const has_continuation_bit = integer & 32;
		integer &= 31;
		value += integer << shift;
		if (has_continuation_bit) shift += 5;
		else {
			const should_negate = value & 1;
			value >>>= 1;
			if (should_negate) result.push(value === 0 ? -2147483648 : -value);
			else result.push(value);
			value = shift = 0;
		}
	}
	return result;
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/core/base-http-request.mjs
var BaseHttpRequest = class {
	constructor(config) {
		this.config = config;
	}
};
var inputValueAsString = (value) => {
	if (typeof value === "object" && "addr" in value) return value.addr.toString();
	return value.toString();
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/core/api-error.mjs
var ApiError = class extends Error {
	url;
	status;
	body;
	constructor(url, status, body) {
		let message = `Request to ${url} failed with status ${status}`;
		if (body && typeof body === "object" && "message" in body && body.message) message += `: ${body.message}`;
		super(message);
		this.url = url;
		this.status = status;
		this.body = body;
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/json.mjs
var JSONbig = (0, import_json_bigint.default)({
	useNativeBigInt: true,
	strict: true
});
/**
* Parse JSON with bigint support.
* @param str - The JSON string to parse.
*/
function parseJson(str) {
	return JSONbig.parse(str, (_, value) => {
		if (value != null && typeof value === "object" && Object.getPrototypeOf(value) == null) Object.setPrototypeOf(value, Object.prototype);
		if (typeof value === "bigint") {
			if (value > Number.MAX_SAFE_INTEGER) return value;
			return Number(value);
		}
		return value;
	});
}
/**
* Convert a JavaScript value to a JSON string with bigint support.
*
* @param value - A JavaScript value, usually an object or array, to be converted.
* @param replacer - A function that transforms the results.
* @param space - Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
*/
function stringifyJson(value, replacer, space) {
	return JSONbig.stringify(value, replacer, space);
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/msgpack.mjs
function decodeMsgpack$1(buffer, options = {
	useMap: true,
	rawBinaryStringKeys: true,
	rawBinaryStringValues: true
}) {
	return decode$1(buffer, {
		intMode: IntMode.AS_ENCODED,
		...options
	});
}
function encodeMsgpack$1(data) {
	return new Uint8Array(encode(data, {
		sortKeys: true,
		ignoreUndefined: true
	}));
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/core/request.mjs
var encodeURIPath = (path) => encodeURI(path).replace(/%5B/g, "[").replace(/%5D/g, "]");
async function request(config, options) {
	let rawPath = options.url.endsWith("/") ? options.url.slice(0, -1) : options.url;
	if (options.path) for (const [key, value] of Object.entries(options.path)) {
		const replace = encodeURIPath(inputValueAsString(value));
		rawPath = rawPath.replace(`{${key}}`, replace);
	}
	const url = new URL(rawPath, config.baseUrl);
	if (config.port !== void 0) url.port = config.port.toString();
	if (options.query) for (const [key, value] of Object.entries(options.query)) {
		if (value === void 0 || value === null) continue;
		url.searchParams.set(key, Array.isArray(value) ? value.map((v) => inputValueAsString(v)).join(",") : inputValueAsString(value));
	}
	const headers = {
		...config.headers ?? {},
		...options.headers ?? {}
	};
	if (config.token) if (typeof config.token === "string") headers["X-Algo-API-Token"] = config.token;
	else for (const [name, value] of Object.entries(config.token)) headers[name] = value;
	const requestContentType = options.headers?.["Content-Type"] ?? options.headers?.["content-type"];
	let bodyPayload = void 0;
	if (options.body != null) if (options.body instanceof Uint8Array) bodyPayload = options.body.slice().buffer;
	else if (typeof options.body === "string") bodyPayload = options.body;
	else if (requestContentType?.includes("msgpack")) bodyPayload = encodeMsgpack$1(options.body).slice().buffer;
	else if (requestContentType?.includes("json")) bodyPayload = stringifyJson(options.body);
	else bodyPayload = stringifyJson(options.body);
	const response = await fetch(url.toString(), {
		method: options.method,
		headers,
		body: bodyPayload
	});
	const responseContentType = response.headers.get("content-type") ?? "";
	if (!response.ok) {
		let errorBody;
		try {
			if (responseContentType.includes("application/msgpack")) errorBody = decodeMsgpack$1(new Uint8Array(await response.arrayBuffer()), {
				useMap: false,
				rawBinaryStringKeys: false,
				rawBinaryStringValues: false
			});
			else if (responseContentType.includes("application/json")) errorBody = parseJson(await response.text());
			else errorBody = await response.text();
		} catch {
			errorBody = void 0;
		}
		throw new ApiError(url.pathname.toString(), response.status, errorBody);
	}
	if (responseContentType.includes("application/msgpack") || responseContentType.includes("application/octet-stream") || responseContentType.includes("application/x-binary")) return new Uint8Array(await response.arrayBuffer());
	if (responseContentType.includes("application/json")) return parseJson(await response.text());
	if (!responseContentType) return new Uint8Array(await response.arrayBuffer());
	return await response.text();
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/core/fetch-http-request.mjs
var RETRY_STATUS_CODES = [
	408,
	413,
	429,
	500,
	502,
	503,
	504
];
var RETRY_ERROR_CODES = [
	"ETIMEDOUT",
	"ECONNRESET",
	"EADDRINUSE",
	"ECONNREFUSED",
	"EPIPE",
	"ENOTFOUND",
	"ENETUNREACH",
	"EAI_AGAIN",
	"EPROTO"
];
var DEFAULT_MAX_TRIES = 5;
var MAX_BACKOFF_MS = 1e4;
var toNumber = (value) => {
	if (typeof value === "number") return Number.isNaN(value) ? void 0 : value;
	if (typeof value === "string") {
		const parsed = Number(value);
		return Number.isNaN(parsed) ? void 0 : parsed;
	}
};
var extractStatus = (error) => {
	if (!error || typeof error !== "object") return;
	const candidate = error;
	return toNumber(candidate.status ?? candidate.response?.status);
};
var extractCode = (error) => {
	if (!error || typeof error !== "object") return;
	const candidate = error;
	const raw = candidate.code ?? candidate.cause?.code;
	return typeof raw === "string" ? raw : void 0;
};
var delay = async (ms) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});
var calculateMaxNumberOfTries = (maxRetries) => {
	if (typeof maxRetries !== "number" || !Number.isFinite(maxRetries)) return DEFAULT_MAX_TRIES;
	return Math.floor(maxRetries) + 1;
};
var FetchHttpRequest = class extends BaseHttpRequest {
	async request(options) {
		const maxTries = calculateMaxNumberOfTries(this.config.maxRetries);
		let attempt = 1;
		let lastError;
		while (attempt <= maxTries) try {
			return await request(this.config, options);
		} catch (error) {
			lastError = error;
			if (!this.shouldRetry(error, attempt, maxTries)) throw error;
			const backoff = attempt === 1 ? 0 : Math.min(1e3 * 2 ** (attempt - 1), MAX_BACKOFF_MS);
			if (backoff > 0) await delay(backoff);
			this.config.logger?.warn(`Request failed ${attempt} times. Retrying in ${backoff}ms: ${error}`);
			attempt += 1;
		}
		throw lastError ?? /* @__PURE__ */ new Error(`Request failed after ${maxTries} attempt(s)`);
	}
	shouldRetry(error, attempt, maxTries) {
		if (attempt >= maxTries) return false;
		const status = extractStatus(error);
		if (status !== void 0) {
			if (RETRY_STATUS_CODES.includes(status)) return true;
		}
		const code = extractCode(error);
		if (code) {
			if (RETRY_ERROR_CODES.includes(code)) return true;
		}
		return false;
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/codec.mjs
/**
* A bidirectional codec that transforms between application types and wire formats.
* Supports format-specific encoding (JSON vs msgpack).
*
* @template T - The application/runtime type (e.g., bigint, string, Uint8Array)
* @template TEncoded - The wire format type (may differ based on format, e.g., bigint → string in JSON)
*/
var Codec = class {
	/**
	* Encode a value, always returning the value regardless of if it is default
	* @param value - The application value
	* @param format - The wire format (json or msgpack)
	* @returns The encoded value, or the default if it is undefined or null
	*/
	encode(value, format) {
		if (value === void 0 || value === null || this.isDefaultValue(value)) return this.toEncoded(this.defaultValue(), format);
		return this.toEncoded(value, format);
	}
	/**
	* Encode a value, omitting it if set to the default value.
	* @param value - The application value
	* @param format - The wire format (json or msgpack)
	* @returns The encoded value, or undefined if it equals the default (will be omitted)
	*/
	encodeOptional(value, format) {
		if (value === void 0 || value === null) return void 0;
		if (this.isDefaultValue(value)) return void 0;
		return this.toEncoded(value, format);
	}
	/**
	* Decode a value from wire format
	* @param value - The wire value
	* @param format - The wire format (json or msgpack)
	* @returns The decoded application value
	*/
	decode(value, format) {
		if (value === void 0 || value === null) return this.defaultValue();
		const decoded = this.fromEncoded(value, format);
		if (this.isDefaultValue(decoded)) return this.defaultValue();
		return decoded;
	}
	/**
	* Decode an optional value from wire format (preserves undefined vs default distinction)
	* @param value - The wire value
	* @param format - The wire format (json or msgpack)
	* @returns The decoded application value, or undefined if wire value was undefined
	*/
	decodeOptional(value, format) {
		if (value === void 0 || value === null) return void 0;
		return this.fromEncoded(value, format);
	}
	/**
	* Transform application value to wire format
	* Override this method to implement encoding logic, otherwise defaults to pass-through
	* @param value - The application value (guaranteed to not be undefined or default)
	* @param format - The wire format
	* @returns The encoded value
	*/
	toEncoded(value, format) {
		return value;
	}
	/**
	* Transform wire format to application value
	* Override this method to implement specific decoding logic, otherwise defaults to pass-through
	* @param value - The wire value (guaranteed to not be undefined)
	* @param format - The wire format
	* @returns The decoded value
	*/
	fromEncoded(value, format) {
		return value;
	}
	/**
	* Check if a value equals the default value (determines if it should be omitted during encoding)
	* Override this method for custom default comparison logic, otherwise defaults to default value equality
	* @param value - The value to check
	* @returns True if value equals default
	*/
	isDefaultValue(value) {
		return value === this.defaultValue();
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/bigint.mjs
var BigIntCodec = class extends Codec {
	defaultValue() {
		return 0n;
	}
	fromEncoded(value, _format) {
		if (typeof value === "bigint") return value;
		if (typeof value === "number" || typeof value === "string") return BigInt(value);
		throw new Error(`Cannot decode bigint from ${typeof value}`);
	}
};
var bigIntCodec = new BigIntCodec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/number.mjs
var NumberCodec = class extends Codec {
	defaultValue() {
		return 0;
	}
	isDefaultValue(value) {
		return value === this.defaultValue() || Number.isNaN(value);
	}
};
var numberCodec = new NumberCodec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/array.mjs
function arrayEqual(a, b) {
	if (a.length !== b.length) return false;
	return Array.from(a).every((val, i) => val === b[i]);
}
function concatArrays(...arrs) {
	const size = arrs.reduce((sum, arr) => sum + arr.length, 0);
	const c = new Uint8Array(size);
	let offset = 0;
	for (let i = 0; i < arrs.length; i++) {
		c.set(arrs[i], offset);
		offset += arrs[i].length;
	}
	return c;
}
//#endregion
//#region node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
	if (le) return {
		h: Number(n & U32_MASK64),
		l: Number(n >> _32n & U32_MASK64)
	};
	return {
		h: Number(n >> _32n & U32_MASK64) | 0,
		l: Number(n & U32_MASK64) | 0
	};
}
function split(lst, le = false) {
	const len = lst.length;
	let Ah = new Uint32Array(len);
	let Al = new Uint32Array(len);
	for (let i = 0; i < len; i++) {
		const { h, l } = fromBig(lst[i], le);
		[Ah[i], Al[i]] = [h, l];
	}
	return [Ah, Al];
}
var fromNumH = (n) => n / 2 ** 32 | 0;
var fromNumL = (n) => n >>> 0;
function setU64FromNum(view, byteOffset, n, isLE) {
	const h = fromNumH(n);
	const l = fromNumL(n);
	view.setUint32(byteOffset, isLE ? l : h, isLE);
	view.setUint32(byteOffset + 4, isLE ? h : l, isLE);
}
var shrSH = (h, _l, s) => h >>> s;
var shrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
var rotr32H = (_h, l) => l;
var rotr32L = (h, _l) => h;
function add(Ah, Al, Bh, Bl) {
	const l = (Al >>> 0) + (Bl >>> 0);
	return {
		h: Ah + Bh + (l / 2 ** 32 | 0) | 0,
		l: l | 0
	};
}
var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
//#endregion
//#region node_modules/@noble/hashes/utils.js
/**
* Checks if something is Uint8Array. Be careful: nodejs Buffer will return true.
* @param a - value to test
* @returns `true` when the value is a Uint8Array-compatible view.
* @example
* Check whether a value is a Uint8Array-compatible view.
* ```ts
* isBytes(new Uint8Array([1, 2, 3]));
* ```
*/
function isBytes$2(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
var atitle$1 = (title) => title ? `"${title}" ` : "";
/**
* Asserts something is a non-negative integer.
* @param n - number to validate
* @param title - label included in thrown errors
* @returns The validated number.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate a non-negative integer option.
* ```ts
* anumber(32, 'length');
* ```
*/
function anumber$1(n, title = "") {
	if (typeof n !== "number") throw new TypeError(atitle$1(title) + "expected number, got " + typeof n);
	if (!Number.isSafeInteger(n) || n < 0) throw new RangeError(atitle$1(title) + "expected integer >= 0, got " + n);
	return n;
}
/**
* Asserts something is a boolean.
* @param value - value to validate
* @param title - label included in thrown errors
* @returns The validated boolean.
* @throws On wrong argument types. {@link TypeError}
* @example
* Validate a boolean option.
* ```ts
* abool(true, 'enableXOF');
* ```
*/
function abool$1(value, title = "") {
	if (typeof value !== "boolean") throw new TypeError(atitle$1(title) + "expected boolean, got type=" + typeof value);
	return value;
}
/**
* Asserts something is Uint8Array.
* @param value - value to validate
* @param length - optional exact length constraint
* @param title - label included in thrown errors
* @returns The validated byte array.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate that a value is a byte array.
* ```ts
* abytes(new Uint8Array([1, 2, 3]));
* ```
*/
function abytes$2(value, length, title = "") {
	if (isBytes$2(value) && (length === void 0 || value.length === length)) return value;
	if (length !== void 0) anumber$1(length, "length");
	const bytes = isBytes$2(value);
	const ofLen = length !== void 0 ? ` of length ${length}` : "";
	const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
	const message = atitle$1(title) + "expected Uint8Array" + ofLen + ", got " + got;
	if (!bytes) throw new TypeError(message);
	throw new RangeError(message);
}
/**
* Copies bytes into a fresh Uint8Array.
* Buffer-style slices can alias the same backing store, so callers that need ownership should copy.
* @param bytes - source bytes to clone
* @returns Freshly allocated copy of `bytes`.
* @throws On wrong argument types. {@link TypeError}
* @example
* Clone a byte array before mutating it.
* ```ts
* const copy = copyBytes(new Uint8Array([1, 2, 3]));
* ```
*/
function copyBytes$1(bytes) {
	return Uint8Array.from(abytes$2(bytes));
}
/**
* Asserts something is a wrapped hash constructor.
* @param h - hash constructor to validate
* @throws On wrong argument types or invalid hash wrapper shape. {@link TypeError}
* @throws On invalid hash metadata ranges or values. {@link RangeError}
* @throws If the hash metadata allows empty outputs or block sizes. {@link Error}
* @example
* Validate a callable hash wrapper.
* ```ts
* import { ahash } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* ahash(sha256);
* ```
*/
function ahash(h) {
	if (typeof h !== "function" || typeof h.create !== "function") throw new TypeError("expected hash wrapped by utils.createHasher");
	anumber$1(h.outputLen);
	anumber$1(h.blockLen);
	if (h.outputLen < 1 || h.blockLen < 1) throw new Error("hash blockLen / outputLen must be >= 1");
}
var aobject$1 = (value, label) => {
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
};
/**
* Asserts a hash instance has not been destroyed or finished.
* @param instance - hash instance to validate
* @param checkFinished - whether to reject finalized instances
* @throws If the hash instance has already been destroyed or finalized. {@link Error}
* @example
* Validate that a hash instance is still usable.
* ```ts
* import { aexists } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const hash = sha256.create();
* aexists(hash);
* ```
*/
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("hash was destroyed");
	if (checkFinished && instance.finished) throw new Error("digest() was already called");
}
/**
* Asserts output is a sufficiently-sized byte array.
* @param out - destination buffer
* @param instance - hash instance providing output length
* Oversized buffers are allowed; downstream code only promises to fill the first `outputLen` bytes.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate a caller-provided digest buffer.
* ```ts
* import { aoutput } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const hash = sha256.create();
* aoutput(new Uint8Array(hash.outputLen), hash);
* ```
*/
function aoutput(out, instance) {
	abytes$2(out, void 0, "output");
	const min = instance.outputLen;
	if (!(out.length >= min)) throw new RangeError("\"output\" expected length >= " + min);
}
/**
* Casts a typed array view to Uint32Array.
* `arr.byteOffset` must already be 4-byte aligned or the platform
* Uint32Array constructor will throw.
* @param arr - source typed array
* @returns Uint32Array view over the same buffer.
* @example
* Reinterpret a byte array as 32-bit words.
* ```ts
* u32(new Uint8Array(8));
* ```
*/
function u32(arr) {
	return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/**
* Zeroizes typed arrays in place. Warning: JS provides no guarantees.
* @param arrays - arrays to overwrite with zeros
* @example
* Zeroize sensitive buffers in place.
* ```ts
* clean(new Uint8Array([1, 2, 3]));
* ```
*/
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/**
* Creates a DataView for byte-level manipulation.
* @param arr - source typed array
* @returns DataView over the same buffer region.
* @example
* Create a DataView over an existing buffer.
* ```ts
* createView(new Uint8Array(4));
* ```
*/
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/**
* Rotate-right operation for uint32 values.
* @param word - source word
* @param shift - shift amount in bits
* @returns Rotated word.
* @example
* Rotate a 32-bit word to the right.
* ```ts
* rotr(0x12345678, 8);
* ```
*/
function rotr(word, shift) {
	return word << 32 - shift | word >>> shift;
}
/** Whether the current platform is little-endian. */
var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
/**
* Byte-swap operation for uint32 values.
* @param word - source word
* @returns Word with reversed byte order.
* @example
* Reverse the byte order of a 32-bit word.
* ```ts
* byteSwap(0x11223344);
* ```
*/
function byteSwap(word) {
	return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
/**
* Conditionally byte-swaps one 32-bit word on big-endian platforms.
* @param n - source word
* @returns Original or byte-swapped word depending on platform endianness.
* @example
* Normalize a 32-bit word for host endianness.
* ```ts
* swap8IfBE(0x11223344);
* ```
*/
var swap8IfBE = isLE ? (n) => n : (n) => byteSwap(n) >>> 0;
/**
* Byte-swaps every word of a Uint32Array in place.
* @param arr - array to mutate
* @returns The same array after mutation; callers pass live state arrays here.
* @example
* Reverse the byte order of every word in place.
* ```ts
* byteSwap32(new Uint32Array([0x11223344]));
* ```
*/
function byteSwap32(arr) {
	for (let i = 0; i < arr.length; i++) arr[i] = byteSwap(arr[i]);
	return arr;
}
/**
* Conditionally byte-swaps a Uint32Array on big-endian platforms.
* @param u - array to normalize for host endianness
* @returns Original or byte-swapped array depending on platform endianness.
*   On big-endian runtimes this mutates `u` in place via `byteSwap32(...)`.
* @example
* Normalize a word array for host endianness.
* ```ts
* swap32IfBE(new Uint32Array([0x11223344]));
* ```
*/
var swap32IfBE = isLE ? (u) => u : byteSwap32;
var hasHexBuiltin = /* @__PURE__ */ (() => typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string.
* Uses the built-in function when available and assumes it matches the tested
* fallback semantics.
* @param bytes - bytes to encode
* @returns Lowercase hexadecimal string.
* @throws On wrong argument types. {@link TypeError}
* @example
* Convert bytes to lowercase hexadecimal.
* ```ts
* bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])); // 'cafe0123'
* ```
*/
function bytesToHex$3(bytes) {
	abytes$2(bytes);
	if (hasHexBuiltin) return bytes.toHex();
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
	return hex;
}
function asciiToBase16(ch) {
	return ch >= 48 && ch <= 57 ? ch - 48 : ch >= 65 && ch <= 70 ? ch - 55 : ch >= 97 && ch <= 102 ? ch - 87 : void 0;
}
/**
* Convert hex string to byte array. Uses built-in function, when available.
* @param hex - hexadecimal string to decode
* @returns Decoded bytes.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Decode lowercase hexadecimal into bytes.
* ```ts
* hexToBytes('cafe0123'); // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
* ```
*/
function hexToBytes$2(hex) {
	if (typeof hex !== "string") throw new TypeError("hex string expected, got " + typeof hex);
	if (hasHexBuiltin) try {
		return Uint8Array.fromHex(hex);
	} catch (error) {
		if (error instanceof SyntaxError) throw new RangeError(error.message);
		throw error;
	}
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) throw new RangeError("hex string expected, got unpadded hex of length " + hl);
	const array = new Uint8Array(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = asciiToBase16(hex.charCodeAt(hi));
		const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) {
			const char = hex[hi] + hex[hi + 1];
			throw new RangeError("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
		}
		array[ai] = n1 * 16 + n2;
	}
	return array;
}
/**
* Copies several Uint8Arrays into one.
* @param arrays - arrays to concatenate
* @returns Concatenated byte array.
* @throws On wrong argument types. {@link TypeError}
* @example
* Concatenate multiple byte arrays.
* ```ts
* concatBytes(new Uint8Array([1]), new Uint8Array([2]));
* ```
*/
function concatBytes$2(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes$2(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
/**
* Merges default options and passed options.
* @param defaults - base option object
* @param opts - user overrides
* @param title - label included in thrown override errors
* @returns Merged option object. The merge mutates `defaults` in place.
* @throws On wrong argument types. {@link TypeError}
* @example
* Merge user overrides onto default options.
* ```ts
* checkOpts({ dkLen: 32 }, { asyncTick: 10 });
* ```
*/
function checkOpts(defaults, opts, title = "opts") {
	aobject$1(defaults, "defaults");
	if (opts !== void 0) aobject$1(opts, title);
	return Object.assign(defaults, opts);
}
/**
* Creates a callable hash function from a stateful class constructor.
* @param hashCons - hash constructor or factory
* @param info - optional metadata such as DER OID
* @returns Frozen callable hash wrapper with `.create()`.
*   Wrapper construction eagerly calls `hashCons(undefined)` once to read
*   `outputLen` / `blockLen`, so constructor side effects happen at module
*   init time.
* @throws On wrong argument types. {@link TypeError}
* @example
* Wrap a stateful hash constructor into a callable helper.
* ```ts
* import { createHasher } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const wrapped = createHasher(sha256.create, { oid: sha256.oid });
* wrapped(new Uint8Array([1]));
* ```
*/
function createHasher(hashCons, info = {}) {
	if (typeof hashCons !== "function") throw new TypeError("\"hashCons\" expected function, got type=" + typeof hashCons);
	info = checkOpts({}, info, "info");
	const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
	const tmp = hashCons(void 0);
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.canXOF = tmp.canXOF;
	hashC.create = (opts) => hashCons(opts);
	Object.assign(hashC, info);
	return Object.freeze(hashC);
}
/**
* Cryptographically secure PRNG backed by `crypto.getRandomValues`.
* @param bytesLength - number of random bytes to generate
* @returns Random bytes.
* The platform `getRandomValues()` implementation still defines any
* single-call length cap, and this helper rejects oversize requests
* with a stable library `RangeError` instead of host-specific errors.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @throws If the current runtime does not provide `crypto.getRandomValues`. {@link Error}
* @example
* Generate a fresh random key or nonce.
* ```ts
* const key = randomBytes(16);
* ```
*/
function randomBytes$1(bytesLength = 32) {
	anumber$1(bytesLength, "bytesLength");
	const cr = typeof globalThis === "object" ? globalThis.crypto : null;
	if (typeof cr?.getRandomValues !== "function") throw new Error("crypto.getRandomValues must be defined");
	if (bytesLength > 65536) throw new RangeError(`"bytesLength" expected <= 65536, got ${bytesLength}`);
	return cr.getRandomValues(new Uint8Array(bytesLength));
}
/**
* Creates OID metadata for NIST hashes with prefix `06 09 60 86 48 01 65 03 04 02`.
* @param suffix - final OID byte for the selected hash.
*   The helper accepts any byte even though only the documented NIST hash
*   suffixes are meaningful downstream.
* @returns Object containing the DER-encoded OID.
* @example
* Build OID metadata for a NIST hash.
* ```ts
* oidNist(0x01);
* ```
*/
var oidNist = (suffix) => ({ oid: Uint8Array.from([
	6,
	9,
	96,
	134,
	72,
	1,
	101,
	3,
	4,
	2,
	suffix
]) });
//#endregion
//#region node_modules/@noble/hashes/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/**
* Shared 32-bit conditional boolean primitive reused by SHA-256, SHA-1, and MD5 `F`.
* Returns bits from `b` when `a` is set, otherwise from `c`.
* The XOR form is equivalent to MD5's `F(X,Y,Z) = XY v not(X)Z` because the masked terms never
* set the same bit.
* @param a - selector word
* @param b - word chosen when selector bit is set
* @param c - word chosen when selector bit is clear
* @returns Mixed 32-bit word.
* @example
* Combine three words with the shared 32-bit choice primitive.
* ```ts
* Chi(0xffffffff, 0x12345678, 0x87654321);
* ```
*/
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/**
* Shared 32-bit majority primitive reused by SHA-256 and SHA-1.
* Returns bits shared by at least two inputs.
* @param a - first input word
* @param b - second input word
* @param c - third input word
* @returns Mixed 32-bit word.
* @example
* Combine three words with the shared 32-bit majority primitive.
* ```ts
* Maj(0xffffffff, 0x12345678, 0x87654321);
* ```
*/
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
* Accepts only byte-aligned `Uint8Array` input, even when the underlying spec describes bit
* strings with partial-byte tails.
* @param blockLen - internal block size in bytes
* @param outputLen - digest size in bytes
* @param padOffset - trailing length field size in bytes
* @param isLE - whether length and state words are encoded in little-endian
* @example
* Use a concrete subclass to get the shared Merkle-Damgard update/digest flow.
* ```ts
* import { _SHA1 } from '@noble/hashes/legacy.js';
* const hash = new _SHA1();
* hash.update(new Uint8Array([97, 98, 99]));
* hash.digest();
* ```
*/
var HashMD = class {
	blockLen;
	outputLen;
	canXOF = false;
	padOffset;
	isLE;
	buffer;
	view;
	finished = false;
	length = 0;
	pos = 0;
	destroyed = false;
	constructor(blockLen, outputLen, padOffset, isLE) {
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView(this.buffer);
	}
	update(data) {
		aexists(this);
		abytes$2(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		let processed = false;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				processed = true;
				continue;
			}
			buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
				processed = true;
			}
		}
		this.length += data.length;
		if (processed) this.roundClean();
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		buffer.fill(0, pos);
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			buffer.fill(0);
		}
		setU64FromNum(view, blockLen - 8, this.length * 8, isLE);
		this.process(view, 0);
		this.roundClean();
		const oview = out === buffer ? view : createView(out);
		const len = this.outputLen;
		const outLen = len / 4;
		const state = this.get();
		if (len % 4 || outLen > state.length) throw new Error("invalid outputLen");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneIntoMeta(to) {
		const { buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (pos) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state from RFC 6234 §6.1: the first 32 bits of the fractional parts of the
* square roots of the first eight prime numbers. Exported as a shared table; callers must treat
* it as read-only because constructors copy words from it by index. */
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
/** Initial SHA512 state from RFC 6234 §6.3: eight RFC 64-bit `H(0)` words stored as sixteen
* big-endian 32-bit halves. Derived from the fractional parts of the square roots of the first
* eight prime numbers. Exported as a shared table; callers must treat it as read-only because
* constructors copy halves from it by index. */
var SHA512_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	4089235720,
	3144134277,
	2227873595,
	1013904242,
	4271175723,
	2773480762,
	1595750129,
	1359893119,
	2917565137,
	2600822924,
	725511199,
	528734635,
	4215389547,
	1541459225,
	327033209
]);
//#endregion
//#region node_modules/@noble/hashes/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out {@link https://www.rfc-editor.org/rfc/rfc4634 | RFC 4634} and
* {@link https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf | FIPS 180-4}.
* @module
*/
/**
* SHA-224 / SHA-256 round constants from RFC 6234 §5.1: the first 32 bits
* of the cube roots of the first 64 primes (2..311).
*/
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/** Reusable SHA-224 / SHA-256 message schedule buffer `W_t` from RFC 6234 §6.2 step 1. */
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
/** Internal SHA-224 / SHA-256 compression engine from RFC 6234 §6.2. */
var SHA2_32B = class extends HashMD {
	A = 0;
	B = 0;
	C = 0;
	D = 0;
	E = 0;
	F = 0;
	G = 0;
	H = 0;
	constructor(outputLen, IV) {
		super(64, outputLen, 8, false);
		this.A = IV[0] | 0;
		this.B = IV[1] | 0;
		this.C = IV[2] | 0;
		this.D = IV[3] | 0;
		this.E = IV[4] | 0;
		this.F = IV[5] | 0;
		this.G = IV[6] | 0;
		this.H = IV[7] | 0;
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	_cloneInto(to) {
		(to ||= new this.constructor()).set(...this.get());
		return this._cloneIntoMeta(to);
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
			SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		clean(SHA256_W);
	}
	destroy() {
		this.destroyed = true;
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean(this.buffer);
	}
};
/** Internal SHA-256 hash class grounded in RFC 6234 §6.2. */
var _SHA256 = class extends SHA2_32B {
	constructor() {
		super(32, SHA256_IV);
	}
};
var K512 = /* @__PURE__ */ (() => split([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((n) => BigInt(n))))();
var SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
var SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
var SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
var SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
/** Internal SHA-384 / SHA-512 compression engine from RFC 6234 §6.4. */
var SHA2_64B = class extends HashMD {
	Ah = 0;
	Al = 0;
	Bh = 0;
	Bl = 0;
	Ch = 0;
	Cl = 0;
	Dh = 0;
	Dl = 0;
	Eh = 0;
	El = 0;
	Fh = 0;
	Fl = 0;
	Gh = 0;
	Gl = 0;
	Hh = 0;
	Hl = 0;
	constructor(outputLen, IV) {
		super(128, outputLen, 16, false);
		this.Ah = IV[0] | 0;
		this.Al = IV[1] | 0;
		this.Bh = IV[2] | 0;
		this.Bl = IV[3] | 0;
		this.Ch = IV[4] | 0;
		this.Cl = IV[5] | 0;
		this.Dh = IV[6] | 0;
		this.Dl = IV[7] | 0;
		this.Eh = IV[8] | 0;
		this.El = IV[9] | 0;
		this.Fh = IV[10] | 0;
		this.Fl = IV[11] | 0;
		this.Gh = IV[12] | 0;
		this.Gl = IV[13] | 0;
		this.Hh = IV[14] | 0;
		this.Hl = IV[15] | 0;
	}
	get() {
		const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		return [
			Ah,
			Al,
			Bh,
			Bl,
			Ch,
			Cl,
			Dh,
			Dl,
			Eh,
			El,
			Fh,
			Fl,
			Gh,
			Gl,
			Hh,
			Hl
		];
	}
	set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
		this.Ah = Ah | 0;
		this.Al = Al | 0;
		this.Bh = Bh | 0;
		this.Bl = Bl | 0;
		this.Ch = Ch | 0;
		this.Cl = Cl | 0;
		this.Dh = Dh | 0;
		this.Dl = Dl | 0;
		this.Eh = Eh | 0;
		this.El = El | 0;
		this.Fh = Fh | 0;
		this.Fl = Fl | 0;
		this.Gh = Gh | 0;
		this.Gl = Gl | 0;
		this.Hh = Hh | 0;
		this.Hl = Hl | 0;
	}
	_cloneInto(to) {
		(to ||= new this.constructor()).set(...this.get());
		return this._cloneIntoMeta(to);
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) {
			SHA512_W_H[i] = view.getUint32(offset);
			SHA512_W_L[i] = view.getUint32(offset += 4);
		}
		for (let i = 16; i < 80; i++) {
			const W15h = SHA512_W_H[i - 15] | 0;
			const W15l = SHA512_W_L[i - 15] | 0;
			const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
			const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
			const W2h = SHA512_W_H[i - 2] | 0;
			const W2l = SHA512_W_L[i - 2] | 0;
			const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
			const SUMl = add4L(s0l, rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6), SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
			const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
			SHA512_W_H[i] = SUMh | 0;
			SHA512_W_L[i] = SUMl | 0;
		}
		let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
		for (let i = 0; i < 80; i++) {
			const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
			const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
			const CHIh = Eh & Fh ^ ~Eh & Gh;
			const CHIl = El & Fl ^ ~El & Gl;
			const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
			const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
			const T1l = T1ll | 0;
			const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
			const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
			const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
			const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
			Hh = Gh | 0;
			Hl = Gl | 0;
			Gh = Fh | 0;
			Gl = Fl | 0;
			Fh = Eh | 0;
			Fl = El | 0;
			({h: Eh, l: El} = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
			Dh = Ch | 0;
			Dl = Cl | 0;
			Ch = Bh | 0;
			Cl = Bl | 0;
			Bh = Ah | 0;
			Bl = Al | 0;
			const All = add3L(T1l, sigma0l, MAJl);
			Ah = add3H(All, T1h, sigma0h, MAJh);
			Al = All | 0;
		}
		({h: Ah, l: Al} = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
		({h: Bh, l: Bl} = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
		({h: Ch, l: Cl} = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
		({h: Dh, l: Dl} = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
		({h: Eh, l: El} = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
		({h: Fh, l: Fl} = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
		({h: Gh, l: Gl} = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
		({h: Hh, l: Hl} = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
		this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
	}
	roundClean() {
		clean(SHA512_W_H, SHA512_W_L);
	}
	destroy() {
		this.destroyed = true;
		clean(this.buffer);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
/** Internal SHA-512 hash class grounded in RFC 6234 §6.3 and §6.4. */
var _SHA512 = class extends SHA2_64B {
	constructor() {
		super(64, SHA512_IV);
	}
};
/** SHA-512/256 IV derived by the SHA-512/t recipe in `test/misc/sha2-gen-iv.js` and
* stored as sixteen big-endian 32-bit halves. */
var T256_IV = /* @__PURE__ */ Uint32Array.from([
	573645204,
	4230739756,
	2673172387,
	3360449730,
	596883563,
	1867755857,
	2520282905,
	1497426621,
	2519219938,
	2827943907,
	3193839141,
	1401305490,
	721525244,
	746961066,
	246885852,
	2177182882
]);
/** Internal SHA-512/256 hash class using the derived `T256_IV` and the shared
* RFC 6234 §6.4 compression engine. */
var _SHA512_256 = class extends SHA2_64B {
	constructor() {
		super(32, T256_IV);
	}
};
/**
* SHA2-256 hash function from RFC 4634. In JS it's the fastest: even faster than Blake3. Some info:
*
* - Trying 2^128 hashes would get 50% chance of collision, using birthday attack.
* - BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
* - Each sha256 hash is executing 2^18 bit operations.
* - Good 2024 ASICs can do 200Th/sec with 3500 watts of power, corresponding to 2^36 hashes/joule.
* @param msg - message bytes to hash
* @param opts - Reserved hash options.
* @returns Digest bytes.
* @example
* Hash a message with SHA2-256.
* ```ts
* sha256(new Uint8Array([97, 98, 99]));
* ```
*/
var sha256 = /* @__PURE__ */ createHasher(() => new _SHA256(), /* @__PURE__ */ oidNist(1));
/**
* SHA2-512 hash function from RFC 4634.
* @param msg - message bytes to hash
* @param opts - Reserved hash options.
* @returns Digest bytes.
* @example
* Hash a message with SHA2-512.
* ```ts
* sha512(new Uint8Array([97, 98, 99]));
* ```
*/
var sha512 = /* @__PURE__ */ createHasher(() => new _SHA512(), /* @__PURE__ */ oidNist(3));
/**
* SHA2-512/256 "truncated" hash function, with improved resistance to length extension attacks.
* See the paper on {@link https://eprint.iacr.org/2010/548.pdf | truncated SHA512}.
* @param msg - message bytes to hash
* @param opts - Reserved hash options.
* @returns Digest bytes.
* @example
* Hash a message with SHA2-512/256.
* ```ts
* sha512_256(new Uint8Array([97, 98, 99]));
* ```
*/
var sha512_256 = /* @__PURE__ */ createHasher(() => new _SHA512_256(), /* @__PURE__ */ oidNist(6));
var MALFORMED_ADDRESS_ERROR_MSG = "address seems to be malformed";
var CHECKSUM_ADDRESS_ERROR_MSG = "wrong checksum for address";
function checksumFromPublicKey(publicKey) {
	return Uint8Array.from(sha512_256(publicKey).slice(28, 32));
}
function bytesToHex$2(bytes) {
	return Buffer.from(bytes).toString("hex");
}
/** Symbol used for instanceof checks across packages (CJS/ESM) */
var ADDR_SYMBOL = Symbol.for("algokit_common:Address");
/**
* Represents an Algorand address
*/
var Address = class Address {
	/**
	* The binary form of the address. For standard accounts, this is the public key.
	*/
	publicKey;
	/** @internal */
	[ADDR_SYMBOL];
	/**
	* Create a new Address object from its binary form.
	* @param publicKey - The binary form of the address. Must be 32 bytes.
	*/
	constructor(publicKey) {
		this[ADDR_SYMBOL] = true;
		if (publicKey.length !== 32) throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: 0x${bytesToHex$2(publicKey)}, length ${publicKey.length}`);
		this.publicKey = publicKey;
	}
	/**
	* Check if the address is equal to another address.
	*/
	equals(other) {
		return other instanceof Address && arrayEqual(this.publicKey, other.publicKey);
	}
	/**
	* Compute the 4 byte checksum of the address.
	*/
	checksum() {
		return checksumFromPublicKey(this.publicKey);
	}
	/**
	* Encode the address into a string form.
	*/
	toString() {
		return import_base32.default.encode(concatArrays(this.publicKey, this.checksum())).slice(0, 58);
	}
	/**
	* Decode an address from a string.
	* @param address - The address to decode. Must be 58 characters long.
	* @returns An Address object corresponding to the input string.
	*/
	static fromString(address) {
		if (typeof address !== "string") throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected string, got ${typeof address}, ${address}`);
		if (address.length !== 58) throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected length 58, got ${address.length}: ${address}`);
		const decoded = import_base32.default.decode.asBytes(address);
		if (decoded.length !== 36) throw new Error(`${MALFORMED_ADDRESS_ERROR_MSG}: expected byte length 36, got ${decoded.length}`);
		const pk = new Uint8Array(decoded.slice(0, 32));
		const cs = new Uint8Array(decoded.slice(32, 36));
		const checksum = checksumFromPublicKey(pk);
		if (!arrayEqual(checksum, cs)) throw new Error(`${CHECKSUM_ADDRESS_ERROR_MSG}: ${address} (${cs}, ${checksum})`);
		return new Address(pk);
	}
	/**
	* Get the zero address.
	*/
	static zeroAddress() {
		return new Address(/* @__PURE__ */ new Uint8Array(32));
	}
};
Object.defineProperty(Address, Symbol.hasInstance, { value: function(obj) {
	if (obj instanceof Object && Object.getPrototypeOf(obj) === Address.prototype) return true;
	return Boolean(obj && typeof obj === "object" && ADDR_SYMBOL in obj && obj[ADDR_SYMBOL]);
} });
new TextEncoder().encode("appID");
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/address.mjs
var AddressCodec = class extends Codec {
	defaultValue() {
		return Address.zeroAddress();
	}
	toEncoded(value, format) {
		if (format === "json") return value.toString();
		return value.publicKey;
	}
	fromEncoded(value, _format) {
		if (typeof value === "string") return Address.fromString(value);
		if (value instanceof Uint8Array) {
			if (value.length === 32) return new Address(value);
			else if (value.length === 58) return Address.fromString(Buffer$1.from(value).toString("utf-8"));
		}
		throw new Error(`AddressCodec cannot decode address from ${typeof value}`);
	}
	isDefaultValue(value) {
		return value.equals(this.defaultValue());
	}
};
var addressCodec = new AddressCodec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/boolean.mjs
var BooleanCodec = class extends Codec {
	defaultValue() {
		return false;
	}
};
var booleanCodec = new BooleanCodec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/bytes.mjs
var BytesCodec = class extends Codec {
	defaultValue() {
		return /* @__PURE__ */ new Uint8Array();
	}
	toEncoded(value, format) {
		if (format === "json") return Buffer$1.from(value).toString("base64");
		return value;
	}
	fromEncoded(value, _format) {
		if (value instanceof Uint8Array) return value;
		if (typeof value === "string") return new Uint8Array(Buffer$1.from(value, "base64"));
		throw new Error(`Cannot decode bytes from ${typeof value}`);
	}
	isDefaultValue(value) {
		return value.byteLength === 0;
	}
};
var bytesCodec = new BytesCodec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/wire.mjs
function normalizeWireKey(key) {
	return key instanceof Uint8Array ? normalizeWireString(key) : key.toString();
}
function normalizeWireString(value) {
	return value instanceof Uint8Array ? Buffer$1.from(value).toString("utf-8") : value;
}
function normalizeWireObject(wireObject) {
	if (wireObject instanceof Map) {
		const normalized = {};
		for (const [key, value] of wireObject.entries()) normalized[normalizeWireKey(key)] = value;
		return normalized;
	}
	return wireObject;
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/string.mjs
var StringCodec = class extends Codec {
	defaultValue() {
		return "";
	}
	fromEncoded(value, _format) {
		return normalizeWireString(value);
	}
};
var stringCodec = new StringCodec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/composite/array.mjs
/**
* Array codec - encodes each element using the item codec
*/
var ArrayCodec = class extends Codec {
	constructor(itemCodec) {
		super();
		this.itemCodec = itemCodec;
	}
	defaultValue() {
		return [];
	}
	toEncoded(value, format) {
		return value.map((item) => this.itemCodec.encode(item, format));
	}
	fromEncoded(value, format) {
		return value.map((item) => this.itemCodec.decode(item, format));
	}
	isDefaultValue(value) {
		return value.length === 0;
	}
};
var bytesArrayCodec = new ArrayCodec(bytesCodec);
var addressArrayCodec = new ArrayCodec(addressCodec);
var bigIntArrayCodec = new ArrayCodec(bigIntCodec);
var numberArrayCodec = new ArrayCodec(numberCodec);
new ArrayCodec(booleanCodec);
var stringArrayCodec = new ArrayCodec(stringCodec);
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/models/object-model.mjs
function isEmptyObject(value) {
	if (value === null || value === void 0) return true;
	if (typeof value !== "object" || Array.isArray(value) || value instanceof Uint8Array) return false;
	if (value instanceof Map) return value.size === 0;
	const keys = Object.keys(value);
	return keys.length === 0 || keys.every((key) => value[key] === void 0);
}
var ObjectModelCodec = class extends Codec {
	resolvedMetadata = void 0;
	resolvedDefaultValue = void 0;
	constructor(metadata) {
		super();
		this.metadata = metadata;
	}
	decode(value, format) {
		if (value === void 0 || value === null) return this.defaultValue();
		return this.fromEncoded(value, format);
	}
	getMetadata() {
		if (!this.resolvedMetadata) this.resolvedMetadata = typeof this.metadata === "function" ? this.metadata() : this.metadata;
		return this.resolvedMetadata;
	}
	defaultValue() {
		if (this.resolvedDefaultValue === void 0) {
			const metadata = this.getMetadata();
			const result = {};
			for (const field of metadata.fields) if (!field.optional) result[field.name] = field.codec.defaultValue();
			this.resolvedDefaultValue = result;
		}
		return this.resolvedDefaultValue;
	}
	isDefaultValue(value) {
		const metadata = this.getMetadata();
		for (const field of metadata.fields) {
			const fieldValue = value[field.name];
			if (field.optional && (fieldValue === void 0 || fieldValue === null)) continue;
			if (!field.codec.isDefaultValue(fieldValue)) return false;
		}
		return true;
	}
	toEncoded(value, format) {
		const metadata = this.getMetadata();
		const result = {};
		for (const field of metadata.fields) {
			const fieldValue = value[field.name];
			if (field.flattened) {
				const encoded = this.encodeFlattenedField(field, fieldValue, format);
				if (encoded !== void 0) Object.assign(result, encoded);
				continue;
			}
			const wireKey = field.wireKey ?? field.name;
			const encoded = field.codec.encodeOptional(fieldValue, format);
			if (encoded !== void 0 && !isEmptyObject(encoded)) result[wireKey] = encoded;
		}
		return result;
	}
	fromEncoded(value, format) {
		const metadata = this.getMetadata();
		const normalizedWireObject = normalizeWireObject(value);
		const result = {};
		for (const field of metadata.fields) if (field.flattened) {
			const decoded = this.decodeFieldValue(field, normalizedWireObject, format);
			if (!isEmptyObject(decoded) || !field.optional) result[field.name] = decoded;
		} else {
			const wireValue = normalizedWireObject[field.wireKey || field.name];
			const decoded = this.decodeFieldValue(field, wireValue, format);
			if (!isEmptyObject(decoded) || !field.optional) result[field.name] = decoded;
		}
		return result;
	}
	encodeFlattenedField(field, fieldValue, format) {
		const encoded = field.codec.encodeOptional(fieldValue, format);
		if (encoded !== void 0 && typeof encoded === "object" && !Array.isArray(encoded)) return normalizeWireObject(encoded);
		return {};
	}
	decodeFieldValue(field, wireValue, format) {
		return field.optional ? field.codec.decodeOptional(wireValue, format) : field.codec.decode(wireValue, format);
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/avm-value.mjs
var AvmValueMeta = {
	name: "AvmValue",
	kind: "object",
	fields: [
		{
			name: "type",
			wireKey: "type",
			optional: false,
			codec: numberCodec
		},
		{
			name: "bytes",
			wireKey: "bytes",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "uint",
			wireKey: "uint",
			optional: true,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/application-kv-storage.mjs
var ApplicationKvStorageMeta = {
	name: "ApplicationKvStorage",
	kind: "object",
	fields: [{
		name: "kvs",
		wireKey: "kvs",
		optional: false,
		codec: new ArrayCodec(new ObjectModelCodec({
			name: "AvmKeyValue",
			kind: "object",
			fields: [{
				name: "key",
				wireKey: "key",
				optional: false,
				codec: bytesCodec
			}, {
				name: "value",
				wireKey: "value",
				optional: false,
				codec: new ObjectModelCodec(AvmValueMeta)
			}]
		}))
	}, {
		name: "account",
		wireKey: "account",
		optional: true,
		codec: addressCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulate-initial-states.mjs
var SimulateInitialStatesMeta = {
	name: "SimulateInitialStates",
	kind: "object",
	fields: [{
		name: "appInitialStates",
		wireKey: "app-initial-states",
		optional: true,
		codec: new ArrayCodec(new ObjectModelCodec({
			name: "ApplicationInitialStates",
			kind: "object",
			fields: [
				{
					name: "id",
					wireKey: "id",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "appLocals",
					wireKey: "app-locals",
					optional: true,
					codec: new ArrayCodec(new ObjectModelCodec(ApplicationKvStorageMeta))
				},
				{
					name: "appGlobals",
					wireKey: "app-globals",
					optional: true,
					codec: new ObjectModelCodec(ApplicationKvStorageMeta)
				},
				{
					name: "appBoxes",
					wireKey: "app-boxes",
					optional: true,
					codec: new ObjectModelCodec(ApplicationKvStorageMeta)
				}
			]
		}))
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulate-trace-config.mjs
var SimulateTraceConfigMeta = {
	name: "SimulateTraceConfig",
	kind: "object",
	fields: [
		{
			name: "enable",
			wireKey: "enable",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "stackChange",
			wireKey: "stack-change",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "scratchChange",
			wireKey: "scratch-change",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "stateChange",
			wireKey: "state-change",
			optional: true,
			codec: booleanCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/transact/src/transactions/reference-types-meta.mjs
/**
* Metadata for BoxReference
*
* Maps wire format (app, name) to BoxReference (appId, name)
*/
var BoxReferenceMeta$1 = {
	name: "BoxReference",
	kind: "object",
	fields: [{
		name: "appId",
		wireKey: "app",
		optional: false,
		codec: bigIntCodec
	}, {
		name: "name",
		wireKey: "name",
		optional: false,
		codec: bytesCodec
	}]
};
/**
* Metadata for HoldingReference
*
* Maps wire format (account, asset) to HoldingReference (address, assetId)
*/
var HoldingReferenceMeta = {
	name: "HoldingReference",
	kind: "object",
	fields: [{
		name: "address",
		wireKey: "account",
		optional: false,
		codec: addressCodec
	}, {
		name: "assetId",
		wireKey: "asset",
		optional: false,
		codec: bigIntCodec
	}]
};
/**
* Metadata for LocalsReference
*
* Maps wire format (account, app) to LocalsReference (address, appId)
*/
var LocalsReferenceMeta = {
	name: "LocalsReference",
	kind: "object",
	fields: [{
		name: "address",
		wireKey: "account",
		optional: false,
		codec: addressCodec
	}, {
		name: "appId",
		wireKey: "app",
		optional: false,
		codec: bigIntCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulate-unnamed-resources-accessed.mjs
var SimulateUnnamedResourcesAccessedMeta = {
	name: "SimulateUnnamedResourcesAccessed",
	kind: "object",
	fields: [
		{
			name: "accounts",
			wireKey: "accounts",
			optional: true,
			codec: addressArrayCodec
		},
		{
			name: "assets",
			wireKey: "assets",
			optional: true,
			codec: bigIntArrayCodec
		},
		{
			name: "apps",
			wireKey: "apps",
			optional: true,
			codec: bigIntArrayCodec
		},
		{
			name: "boxes",
			wireKey: "boxes",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(BoxReferenceMeta$1))
		},
		{
			name: "extraBoxRefs",
			wireKey: "extra-box-refs",
			optional: true,
			codec: numberCodec
		},
		{
			name: "assetHoldings",
			wireKey: "asset-holdings",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(HoldingReferenceMeta))
		},
		{
			name: "appLocals",
			wireKey: "app-locals",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(LocalsReferenceMeta))
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/models/array-model.mjs
var ArrayModelCodec = class extends Codec {
	resolvedMetadata = void 0;
	constructor(metadata) {
		super();
		this.metadata = metadata;
	}
	getMetadata() {
		if (!this.resolvedMetadata) this.resolvedMetadata = typeof this.metadata === "function" ? this.metadata() : this.metadata;
		return this.resolvedMetadata;
	}
	defaultValue() {
		return this.getMetadata().codec.defaultValue();
	}
	isDefaultValue(value) {
		return this.getMetadata().codec.isDefaultValue(value);
	}
	encode(value, format) {
		return this.getMetadata().codec.encode(value, format);
	}
	encodeOptional(value, format) {
		return this.getMetadata().codec.encodeOptional(value, format);
	}
	decode(value, format) {
		return this.getMetadata().codec.decode(value, format);
	}
	decodeOptional(value, format) {
		return this.getMetadata().codec.decodeOptional(value, format);
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/fixed-bytes.mjs
var FixedBytesCodec = class extends Codec {
	constructor(length) {
		super();
		this.length = length;
	}
	defaultValue() {
		return new Uint8Array(this.length);
	}
	toEncoded(value, format) {
		if (format === "json") return Buffer$1.from(value).toString("base64");
		return value;
	}
	fromEncoded(value, _format) {
		if (value instanceof Uint8Array) return value;
		if (typeof value === "string") return new Uint8Array(Buffer$1.from(value, "base64"));
		throw new Error(`Cannot decode fixed ${this.length} bytes from ${typeof value}`);
	}
	isDefaultValue(value) {
		if (value.byteLength !== this.length) return false;
		return value.every((byte) => byte === 0);
	}
};
var fixedBytes32Codec = new FixedBytesCodec(32);
var fixedBytes64Codec = new FixedBytesCodec(64);
var fixedBytes1793Codec = new FixedBytesCodec(1793);
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/crypto/src/hash.mjs
/**
* Computes an Algorand-compatible SHA-512/256 hash.
*/
function hash(bytes) {
	return sha512_256(bytes).slice(0, 32);
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/transact/src/transactions/transaction-type.mjs
/**
* Supported transaction types
*/
var TransactionType = /* @__PURE__ */ function(TransactionType) {
	/**
	* Payment transaction
	*/
	TransactionType["Payment"] = "pay";
	/**
	* Key registration transaction
	*/
	TransactionType["KeyRegistration"] = "keyreg";
	/**
	* Asset configuration transaction
	*/
	TransactionType["AssetConfig"] = "acfg";
	/**
	* Asset transfer transaction
	*/
	TransactionType["AssetTransfer"] = "axfer";
	/**
	* Asset freeze transaction
	*/
	TransactionType["AssetFreeze"] = "afrz";
	/**
	* Application transaction
	*/
	TransactionType["AppCall"] = "appl";
	/**
	* State proof transaction
	*/
	TransactionType["StateProof"] = "stpf";
	/**
	* Heartbeat transaction
	*/
	TransactionType["Heartbeat"] = "hb";
	/**
	* Unknown transaction type
	* Used when decoding transactions with unrecognized type values.
	* This should not be used when creating new transactions.
	*/
	TransactionType["Unknown"] = "unknown";
	return TransactionType;
}({});
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/composite/map.mjs
/**
* Map codec - handles Maps with any key type (including Uint8Array, bigint, number)
* Depending on the encoding format, the map is encoded differently:
* - json: Supports string and bigint keys. The map is represented as an object when encoding.
*   Bigint keys are converted to/from strings (e.g., 1n becomes "1").
*   An exception is thrown upon encountering an unsupported key type.
* - msgpack: Preserves key types and is represented as a Map when encoding.
*/
var MapCodec = class extends Codec {
	keyType;
	constructor(keyCodec, valueCodec) {
		super();
		this.keyCodec = keyCodec;
		this.valueCodec = valueCodec;
		const defaultKeyValue = this.keyCodec.defaultValue();
		this.keyType = defaultKeyValue instanceof Uint8Array ? "Uint8Array" : typeof defaultKeyValue;
	}
	defaultValue() {
		return /* @__PURE__ */ new Map();
	}
	ensureKeyIsSupported(format) {
		if (format === "msgpack") return true;
		if (this.keyType !== "string" && this.keyType !== "bigint") throw new Error(`Map key of type '${this.keyType}' is not supported in ${format} format`);
	}
	toEncoded(value, format) {
		this.ensureKeyIsSupported(format);
		const entries = [];
		for (const [k, v] of value.entries()) {
			const encodedKey = this.keyCodec.encode(k, format);
			const encodedValue = this.valueCodec.encode(v, format);
			entries.push([encodedKey, encodedValue]);
		}
		if (format === "json") {
			const obj = {};
			for (const [k, v] of entries) {
				const keyStr = typeof k === "string" ? k : String(k);
				obj[keyStr] = v;
			}
			return obj;
		}
		return new Map(entries);
	}
	fromEncoded(value, format) {
		this.ensureKeyIsSupported(format);
		const result = /* @__PURE__ */ new Map();
		let entries;
		if (value instanceof Map) entries = Array.from(value.entries());
		else entries = Object.entries(value);
		for (const [encodedKey, encodedValue] of entries) {
			let keyToDecode = encodedKey;
			if (format === "json" && this.keyType === "bigint" && typeof encodedKey === "string") keyToDecode = BigInt(encodedKey);
			const key = this.keyCodec.decode(keyToDecode, format);
			const val = this.valueCodec.decode(encodedValue, format);
			result.set(key, val);
		}
		return result;
	}
	isDefaultValue(value) {
		return value.size === 0;
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/transact/src/transactions/transaction-meta.mjs
var TransactionTypeCodec = class extends Codec {
	defaultValue() {
		return TransactionType.Unknown;
	}
	toEncoded(value, _format) {
		switch (value) {
			case TransactionType.Payment: return "pay";
			case TransactionType.AssetTransfer: return "axfer";
			case TransactionType.AssetFreeze: return "afrz";
			case TransactionType.AssetConfig: return "acfg";
			case TransactionType.KeyRegistration: return "keyreg";
			case TransactionType.AppCall: return "appl";
			case TransactionType.StateProof: return "stpf";
			case TransactionType.Heartbeat: return "hb";
			default: return "unknown";
		}
	}
	fromEncoded(value, _format) {
		switch (normalizeWireString(value)) {
			case "pay": return TransactionType.Payment;
			case "axfer": return TransactionType.AssetTransfer;
			case "afrz": return TransactionType.AssetFreeze;
			case "acfg": return TransactionType.AssetConfig;
			case "keyreg": return TransactionType.KeyRegistration;
			case "appl": return TransactionType.AppCall;
			case "stpf": return TransactionType.StateProof;
			case "hb": return TransactionType.Heartbeat;
			default: return TransactionType.Unknown;
		}
	}
};
var TransactionDataCodec = class extends Codec {
	transactionDataCodec;
	constructor(transactionType, transactionTypeDataMetadata) {
		super();
		this.transactionType = transactionType;
		this.transactionDataCodec = new ObjectModelCodec(transactionTypeDataMetadata);
	}
	defaultValue() {}
	toEncoded(value, format) {
		if (!value) throw new Error("Transaction data is missing");
		return this.transactionDataCodec.encode(value, format);
	}
	fromEncoded(value, format) {
		if (value.type === void 0) throw new Error("Transaction is missing type field");
		if (normalizeWireString(value.type) === this.transactionType.toString()) return this.transactionDataCodec.decode(value, format);
	}
};
var AssetConfigDataCodec = class extends Codec {
	assetParamsCodec = new ObjectModelCodec(AssetParamsMeta$2);
	defaultValue() {}
	toEncoded(value, format) {
		const result = {};
		if (!value) throw new Error("Transaction is not an asset config");
		const { assetId, ...assetParams } = value;
		const encodedAssetId = bigIntCodec.encodeOptional(assetId, format);
		if (encodedAssetId !== void 0) result.caid = encodedAssetId;
		const encodedParams = this.assetParamsCodec.encodeOptional(assetParams, format);
		if (encodedParams && Object.keys(encodedParams).length > 0) result.apar = encodedParams;
		return result;
	}
	fromEncoded(value, format) {
		if (value.type === void 0) throw new Error("Transaction is missing type field");
		const type = normalizeWireString(value.type);
		const caid = value.caid;
		const apar = value.apar;
		if (type !== TransactionType.AssetConfig || caid === void 0 && !apar) return;
		return {
			assetId: bigIntCodec.decode(caid, format),
			...this.assetParamsCodec.decode(apar, format)
		};
	}
	isDefaultValue(value) {
		return value === void 0;
	}
};
var AppCallDataCodec = class extends Codec {
	appCallFieldsCodec = new ObjectModelCodec(AppCallTransactionFieldsMeta);
	defaultValue() {}
	encodeResourceReferences(appId, resourceReferences, format) {
		if (!resourceReferences || resourceReferences.length === 0) return void 0;
		const accessList = [];
		const ensure = (target) => {
			for (let idx = 0; idx < accessList.length; idx++) {
				const entry = accessList[idx];
				const matchesAddress = !entry.d && !target.address || entry.d && target.address && addressCodec.decode(entry.d, format).equals(target.address);
				const matchesAssetId = entry.s === void 0 && target.assetId === void 0 || entry.s !== void 0 && target.assetId !== void 0 && bigIntCodec.decode(entry.s, format) === target.assetId;
				const matchesAppId = entry.p === void 0 && target.appId === void 0 || entry.p !== void 0 && target.appId !== void 0 && bigIntCodec.decode(entry.p, format) === target.appId;
				if (matchesAddress && matchesAssetId && matchesAppId) return idx + 1;
			}
			if (target.address && !target.address.equals(Address.zeroAddress())) accessList.push({ d: addressCodec.encodeOptional(target.address, format) });
			if (target.assetId !== void 0) accessList.push({ s: bigIntCodec.encodeOptional(target.assetId, format) });
			if (target.appId !== void 0) accessList.push({ p: bigIntCodec.encodeOptional(target.appId, format) });
			return accessList.length;
		};
		for (const resourceRef of resourceReferences) {
			if (resourceRef.address || resourceRef.assetId !== void 0 || resourceRef.appId !== void 0) {
				ensure(resourceRef);
				continue;
			}
			if (resourceRef.holding) {
				const holding = resourceRef.holding;
				let addressIndex = 0;
				if (holding.address && !holding.address.equals(Address.zeroAddress())) addressIndex = ensure({ address: holding.address });
				const assetIndex = ensure({ assetId: holding.assetId });
				accessList.push({ h: {
					d: numberCodec.encodeOptional(addressIndex, format),
					s: numberCodec.encodeOptional(assetIndex, format)
				} });
				continue;
			}
			if (resourceRef.locals) {
				const locals = resourceRef.locals;
				let addressIndex = 0;
				if (locals.address && !locals.address.equals(Address.zeroAddress())) addressIndex = ensure({ address: locals.address });
				let appIndex = 0;
				if (locals.appId && locals.appId !== appId) appIndex = ensure({ appId: locals.appId });
				if (addressIndex !== 0 || appIndex !== 0) accessList.push({ l: {
					d: numberCodec.encodeOptional(addressIndex, format),
					p: numberCodec.encodeOptional(appIndex, format)
				} });
				continue;
			}
			if (resourceRef.box) {
				const box = resourceRef.box;
				let appIndex = 0;
				if (box.appId && box.appId !== appId) appIndex = ensure({ appId: box.appId });
				accessList.push({ b: {
					i: numberCodec.encodeOptional(appIndex, format),
					n: bytesCodec.encodeOptional(box.name, format)
				} });
				continue;
			}
		}
		return accessList.length > 0 ? accessList : void 0;
	}
	decodeResourceReferences(_wireResourceReferences, format) {
		if (!_wireResourceReferences || _wireResourceReferences.length === 0) return [];
		const result = [];
		const wireResourceReferences = _wireResourceReferences.map((ref) => normalizeWireObject(ref));
		for (const ref of wireResourceReferences) {
			const d = ref.d;
			const s = ref.s;
			const p = ref.p;
			const _h = ref.h;
			const h = _h ? normalizeWireObject(_h) : void 0;
			const _l = ref.l;
			const l = _l ? normalizeWireObject(_l) : void 0;
			const _b = ref.b;
			const b = _b ? normalizeWireObject(_b) : void 0;
			if (d) {
				result.push({ address: addressCodec.decode(d, format) });
				continue;
			}
			if (s !== void 0) {
				result.push({ assetId: bigIntCodec.decode(s, format) });
				continue;
			}
			if (p !== void 0) {
				result.push({ appId: bigIntCodec.decode(p, format) });
				continue;
			}
			if (h) {
				const addrIdx = h.d ?? 0;
				const assetIdx = h.s;
				if (assetIdx === void 0) throw new Error("Access list holding reference is missing asset index");
				const holdingAddress = addrIdx === 0 ? Address.zeroAddress() : addressCodec.decode(wireResourceReferences[addrIdx - 1].d, format);
				const holdingAssetId = wireResourceReferences[assetIdx - 1].s;
				result.push({ holding: {
					assetId: bigIntCodec.decode(holdingAssetId, format),
					address: holdingAddress
				} });
				continue;
			}
			if (l) {
				const addrIdx = l.d ?? 0;
				const appIdx = l.p ?? 0;
				const localsAddress = addrIdx === 0 ? Address.zeroAddress() : addressCodec.decode(wireResourceReferences[addrIdx - 1].d, format);
				const localsAppId = appIdx === 0 ? 0n : wireResourceReferences[appIdx - 1].p;
				result.push({ locals: {
					appId: bigIntCodec.decode(localsAppId, format),
					address: localsAddress
				} });
				continue;
			}
			if (b) {
				const boxAppIdx = b.i ?? 0;
				const name = b.n;
				if (!name) throw new Error("Access list box reference is missing name");
				const boxAppId = boxAppIdx === 0 ? 0n : wireResourceReferences[boxAppIdx - 1].p;
				result.push({ box: {
					appId: bigIntCodec.decode(boxAppId, format),
					name: bytesCodec.decode(name, format)
				} });
				continue;
			}
		}
		return result;
	}
	encodeBoxReferences(appId, appReferences, boxReferences, format) {
		if (!boxReferences || boxReferences.length === 0) return void 0;
		const appRefs = appReferences ?? [];
		return boxReferences.map((box) => {
			const isCurrentApp = box.appId === 0n || box.appId === appId;
			const index = isCurrentApp ? 0 : appRefs.indexOf(box.appId) + 1;
			if (index === 0 && !isCurrentApp) throw new Error(`Box ref with appId ${box.appId} not in appReferences`);
			return {
				i: numberCodec.encodeOptional(index, format),
				n: bytesCodec.encodeOptional(box.name, format)
			};
		});
	}
	decodeBoxReferences(appReferences, wireBoxReferences, format) {
		if (!wireBoxReferences || wireBoxReferences.length === 0) return [];
		return wireBoxReferences.map((_box) => {
			const box = normalizeWireObject(_box);
			const boxIndex = box.i;
			const boxName = box.n;
			const index = boxIndex ?? 0;
			let appId;
			if (index === 0) appId = 0n;
			else {
				const foreignAppId = appReferences?.[index - 1];
				if (foreignAppId === void 0) throw new Error(`Failed to find the app reference at index ${index - 1}`);
				appId = bigIntCodec.decode(foreignAppId, format);
			}
			return {
				appId,
				name: bytesCodec.decode(boxName, format)
			};
		});
	}
	toEncoded(value, format) {
		const result = {};
		if (!value) throw new Error("Transaction is not an app call");
		const encodedParams = this.appCallFieldsCodec.encodeOptional(value, format);
		if (encodedParams && Object.keys(encodedParams).length > 0) Object.assign(result, encodedParams);
		const wireBoxReferences = this.encodeBoxReferences(value.appId, value.appReferences, value.boxReferences, format);
		if (wireBoxReferences) result.apbx = wireBoxReferences;
		const wireAccessReferences = this.encodeResourceReferences(value.appId, value.accessReferences, format);
		if (wireAccessReferences) result.al = wireAccessReferences;
		return result;
	}
	fromEncoded(value, format) {
		if (value.type === void 0) throw new Error("Transaction is missing type field");
		if (normalizeWireString(value.type) !== TransactionType.AppCall) return;
		const appReferences = value.apfa;
		const wireBoxReferences = value.apbx;
		const wireAccessReferences = value.al;
		const boxReferences = this.decodeBoxReferences(appReferences?.map((ar) => bigIntCodec.decode(ar, format)), wireBoxReferences, format);
		const accessReferences = this.decodeResourceReferences(wireAccessReferences, format);
		return {
			...this.appCallFieldsCodec.decode(value, format),
			...accessReferences.length > 0 && { accessReferences },
			...boxReferences.length > 0 && { boxReferences }
		};
	}
	isDefaultValue(value) {
		return value === void 0;
	}
};
var PaymentTransactionFieldsMeta = {
	name: "PaymentTransactionFields",
	kind: "object",
	fields: [
		{
			name: "amount",
			wireKey: "amt",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "receiver",
			wireKey: "rcv",
			optional: false,
			codec: addressCodec
		},
		{
			name: "closeRemainderTo",
			wireKey: "close",
			optional: true,
			codec: addressCodec
		}
	]
};
var AssetTransferTransactionFieldsMeta = {
	name: "AssetTransferTransactionFields",
	kind: "object",
	fields: [
		{
			name: "assetId",
			wireKey: "xaid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "amount",
			wireKey: "aamt",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "receiver",
			wireKey: "arcv",
			optional: false,
			codec: addressCodec
		},
		{
			name: "assetSender",
			wireKey: "asnd",
			optional: true,
			codec: addressCodec
		},
		{
			name: "closeRemainderTo",
			wireKey: "aclose",
			optional: true,
			codec: addressCodec
		}
	]
};
var AssetFreezeTransactionFieldsMeta = {
	name: "AssetFreezeTransactionFields",
	kind: "object",
	fields: [
		{
			name: "assetId",
			wireKey: "faid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "freezeTarget",
			wireKey: "fadd",
			optional: false,
			codec: addressCodec
		},
		{
			name: "frozen",
			wireKey: "afrz",
			optional: false,
			codec: booleanCodec
		}
	]
};
var KeyRegistrationTransactionFieldsMeta = {
	name: "KeyRegistrationTransactionFields",
	kind: "object",
	fields: [
		{
			name: "voteKey",
			wireKey: "votekey",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "selectionKey",
			wireKey: "selkey",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "stateProofKey",
			wireKey: "sprfkey",
			optional: true,
			codec: fixedBytes64Codec
		},
		{
			name: "voteFirst",
			wireKey: "votefst",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "voteLast",
			wireKey: "votelst",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "voteKeyDilution",
			wireKey: "votekd",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "nonParticipation",
			wireKey: "nonpart",
			optional: true,
			codec: booleanCodec
		}
	]
};
var AssetParamsMeta$2 = {
	name: "AssetParams",
	kind: "object",
	fields: [
		{
			name: "total",
			wireKey: "t",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "decimals",
			wireKey: "dc",
			optional: true,
			codec: numberCodec
		},
		{
			name: "defaultFrozen",
			wireKey: "df",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "unitName",
			wireKey: "un",
			optional: true,
			codec: stringCodec
		},
		{
			name: "assetName",
			wireKey: "an",
			optional: true,
			codec: stringCodec
		},
		{
			name: "url",
			wireKey: "au",
			optional: true,
			codec: stringCodec
		},
		{
			name: "metadataHash",
			wireKey: "am",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "manager",
			wireKey: "m",
			optional: true,
			codec: addressCodec
		},
		{
			name: "reserve",
			wireKey: "r",
			optional: true,
			codec: addressCodec
		},
		{
			name: "freeze",
			wireKey: "f",
			optional: true,
			codec: addressCodec
		},
		{
			name: "clawback",
			wireKey: "c",
			optional: true,
			codec: addressCodec
		}
	]
};
var StateSchemaMeta$1 = {
	name: "StateSchema",
	kind: "object",
	fields: [{
		name: "numUints",
		wireKey: "nui",
		optional: false,
		codec: numberCodec
	}, {
		name: "numByteSlices",
		wireKey: "nbs",
		optional: false,
		codec: numberCodec
	}]
};
var AppCallTransactionFieldsMeta = {
	name: "AppCallTransactionFields",
	kind: "object",
	fields: [
		{
			name: "appId",
			wireKey: "apid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "onComplete",
			wireKey: "apan",
			optional: false,
			codec: numberCodec
		},
		{
			name: "approvalProgram",
			wireKey: "apap",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "clearStateProgram",
			wireKey: "apsu",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "globalStateSchema",
			wireKey: "apgs",
			optional: true,
			codec: new ObjectModelCodec(StateSchemaMeta$1)
		},
		{
			name: "localStateSchema",
			wireKey: "apls",
			optional: true,
			codec: new ObjectModelCodec(StateSchemaMeta$1)
		},
		{
			name: "extraProgramPages",
			wireKey: "apep",
			optional: true,
			codec: numberCodec
		},
		{
			name: "args",
			wireKey: "apaa",
			optional: true,
			codec: bytesArrayCodec
		},
		{
			name: "accountReferences",
			wireKey: "apat",
			optional: true,
			codec: addressArrayCodec
		},
		{
			name: "appReferences",
			wireKey: "apfa",
			optional: true,
			codec: bigIntArrayCodec
		},
		{
			name: "assetReferences",
			wireKey: "apas",
			optional: true,
			codec: bigIntArrayCodec
		},
		{
			name: "rejectVersion",
			wireKey: "aprv",
			optional: true,
			codec: numberCodec
		}
	]
};
var MerkleArrayProofMeta$1 = {
	name: "MerkleArrayProof",
	kind: "object",
	fields: [
		{
			name: "path",
			wireKey: "pth",
			optional: false,
			codec: bytesArrayCodec
		},
		{
			name: "hashFactory",
			wireKey: "hsh",
			optional: false,
			codec: new ObjectModelCodec({
				name: "HashFactory",
				kind: "object",
				fields: [{
					name: "hashType",
					wireKey: "t",
					optional: false,
					codec: numberCodec
				}]
			})
		},
		{
			name: "treeDepth",
			wireKey: "td",
			optional: false,
			codec: numberCodec
		}
	]
};
var FalconVerifierMeta = {
	name: "FalconVerifier",
	kind: "object",
	fields: [{
		name: "publicKey",
		wireKey: "k",
		optional: false,
		codec: fixedBytes1793Codec
	}]
};
var SigslotCommitMeta = {
	name: "SigslotCommit",
	kind: "object",
	fields: [{
		name: "sig",
		wireKey: "s",
		optional: false,
		codec: new ObjectModelCodec({
			name: "FalconSignatureStruct",
			kind: "object",
			fields: [
				{
					name: "signature",
					wireKey: "sig",
					optional: false,
					codec: bytesCodec
				},
				{
					name: "vectorCommitmentIndex",
					wireKey: "idx",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "proof",
					wireKey: "prf",
					optional: false,
					codec: new ObjectModelCodec(MerkleArrayProofMeta$1)
				},
				{
					name: "verifyingKey",
					wireKey: "vkey",
					optional: false,
					codec: new ObjectModelCodec(FalconVerifierMeta)
				}
			]
		})
	}, {
		name: "lowerSigWeight",
		wireKey: "l",
		optional: false,
		codec: bigIntCodec
	}]
};
var ParticipantMeta = {
	name: "Participant",
	kind: "object",
	fields: [{
		name: "verifier",
		wireKey: "p",
		optional: false,
		codec: new ObjectModelCodec({
			name: "MerkleSignatureVerifier",
			kind: "object",
			fields: [{
				name: "commitment",
				wireKey: "cmt",
				optional: false,
				codec: fixedBytes64Codec
			}, {
				name: "keyLifetime",
				wireKey: "lf",
				optional: false,
				codec: bigIntCodec
			}]
		})
	}, {
		name: "weight",
		wireKey: "w",
		optional: false,
		codec: bigIntCodec
	}]
};
var RevealMeta = {
	name: "Reveal",
	kind: "object",
	fields: [{
		name: "sigslot",
		wireKey: "s",
		optional: false,
		codec: new ObjectModelCodec(SigslotCommitMeta)
	}, {
		name: "participant",
		wireKey: "p",
		optional: false,
		codec: new ObjectModelCodec(ParticipantMeta)
	}]
};
var StateProofMeta$1 = {
	name: "StateProof",
	kind: "object",
	fields: [
		{
			name: "sigCommit",
			wireKey: "c",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "signedWeight",
			wireKey: "w",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "sigProofs",
			wireKey: "S",
			optional: false,
			codec: new ObjectModelCodec(MerkleArrayProofMeta$1)
		},
		{
			name: "partProofs",
			wireKey: "P",
			optional: false,
			codec: new ObjectModelCodec(MerkleArrayProofMeta$1)
		},
		{
			name: "merkleSignatureSaltVersion",
			wireKey: "v",
			optional: false,
			codec: numberCodec
		},
		{
			name: "reveals",
			wireKey: "r",
			optional: false,
			codec: new MapCodec(bigIntCodec, new ObjectModelCodec(RevealMeta))
		},
		{
			name: "positionsToReveal",
			wireKey: "pr",
			optional: false,
			codec: bigIntArrayCodec
		}
	]
};
var StateProofMessageMeta$1 = {
	name: "StateProofMessage",
	kind: "object",
	fields: [
		{
			name: "blockHeadersCommitment",
			wireKey: "b",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "votersCommitment",
			wireKey: "v",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "lnProvenWeight",
			wireKey: "P",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "firstAttestedRound",
			wireKey: "f",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "lastAttestedRound",
			wireKey: "l",
			optional: false,
			codec: bigIntCodec
		}
	]
};
var StateProofTransactionFieldsMeta = {
	name: "StateProofTransactionFields",
	kind: "object",
	fields: [
		{
			name: "stateProofType",
			wireKey: "sptype",
			optional: false,
			codec: numberCodec
		},
		{
			name: "stateProof",
			wireKey: "sp",
			optional: true,
			codec: new ObjectModelCodec(StateProofMeta$1)
		},
		{
			name: "message",
			wireKey: "spmsg",
			optional: true,
			codec: new ObjectModelCodec(StateProofMessageMeta$1)
		}
	]
};
var HeartbeatTransactionFieldsMeta = {
	name: "HeartbeatTransactionFields",
	kind: "object",
	fields: [
		{
			name: "address",
			wireKey: "a",
			optional: false,
			codec: addressCodec
		},
		{
			name: "proof",
			wireKey: "prf",
			optional: false,
			codec: new ObjectModelCodec({
				name: "HeartbeatProof",
				kind: "object",
				fields: [
					{
						name: "sig",
						wireKey: "s",
						optional: false,
						codec: fixedBytes64Codec
					},
					{
						name: "pk",
						wireKey: "p",
						optional: false,
						codec: fixedBytes32Codec
					},
					{
						name: "pk2",
						wireKey: "p2",
						optional: false,
						codec: fixedBytes32Codec
					},
					{
						name: "pk1Sig",
						wireKey: "p1s",
						optional: false,
						codec: fixedBytes64Codec
					},
					{
						name: "pk2Sig",
						wireKey: "p2s",
						optional: false,
						codec: fixedBytes64Codec
					}
				]
			})
		},
		{
			name: "seed",
			wireKey: "sd",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "voteId",
			wireKey: "vid",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "keyDilution",
			wireKey: "kd",
			optional: false,
			codec: bigIntCodec
		}
	]
};
var transactionParamsCodec = new ObjectModelCodec({
	name: "TransactionParams",
	kind: "object",
	fields: [
		{
			name: "type",
			wireKey: "type",
			optional: false,
			codec: new TransactionTypeCodec()
		},
		{
			name: "sender",
			wireKey: "snd",
			optional: false,
			codec: addressCodec
		},
		{
			name: "fee",
			wireKey: "fee",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "firstValid",
			wireKey: "fv",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "lastValid",
			wireKey: "lv",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "genesisHash",
			wireKey: "gh",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "genesisId",
			wireKey: "gen",
			optional: true,
			codec: stringCodec
		},
		{
			name: "note",
			wireKey: "note",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "rekeyTo",
			wireKey: "rekey",
			optional: true,
			codec: addressCodec
		},
		{
			name: "lease",
			wireKey: "lx",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "group",
			wireKey: "grp",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "payment",
			flattened: true,
			optional: true,
			codec: new TransactionDataCodec(TransactionType.Payment, PaymentTransactionFieldsMeta)
		},
		{
			name: "assetTransfer",
			flattened: true,
			optional: true,
			codec: new TransactionDataCodec(TransactionType.AssetTransfer, AssetTransferTransactionFieldsMeta)
		},
		{
			name: "assetFreeze",
			flattened: true,
			optional: true,
			codec: new TransactionDataCodec(TransactionType.AssetFreeze, AssetFreezeTransactionFieldsMeta)
		},
		{
			name: "keyRegistration",
			flattened: true,
			optional: true,
			codec: new TransactionDataCodec(TransactionType.KeyRegistration, KeyRegistrationTransactionFieldsMeta)
		},
		{
			name: "assetConfig",
			flattened: true,
			optional: true,
			codec: new AssetConfigDataCodec()
		},
		{
			name: "heartbeat",
			wireKey: "hb",
			optional: true,
			codec: new ObjectModelCodec(HeartbeatTransactionFieldsMeta)
		},
		{
			name: "appCall",
			flattened: true,
			optional: true,
			codec: new AppCallDataCodec()
		},
		{
			name: "stateProof",
			flattened: true,
			optional: true,
			codec: new TransactionDataCodec(TransactionType.StateProof, StateProofTransactionFieldsMeta)
		}
	]
});
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/transact/src/transactions/transaction.mjs
/** Symbol used for instanceof checks across packages (CJS/ESM) */
var TXN_SYMBOL = Symbol.for("algokit_transact:Transaction");
/**
* Represents a complete Algorand transaction.
*/
var Transaction = class {
	/** @internal */
	[TXN_SYMBOL];
	/**
	* The type of transaction
	*/
	type;
	/**
	* The account that authorized the transaction.
	*
	* Fees are deducted from this account.
	*/
	sender;
	/**
	* Optional transaction fee in microALGO.
	*
	* When not set, the fee will be interpreted as 0 by the network.
	*/
	fee;
	/**
	* First round for when the transaction is valid.
	*/
	firstValid;
	/**
	* Last round for when the transaction is valid.
	*
	* After this round, the transaction will be expired.
	*/
	lastValid;
	/**
	* Hash of the genesis block of the network.
	*
	* Used to identify which network the transaction is for.
	*/
	genesisHash;
	/**
	* Genesis ID of the network.
	*
	* A human-readable string used alongside genesis hash to identify the network.
	*/
	genesisId;
	/**
	* Optional user-defined note field.
	*
	* Can contain arbitrary data up to 1KB in size.
	*/
	note;
	/**
	* Optional authorized account for future transactions.
	*
	* If set, only this account will be used for transaction authorization going forward.
	* Reverting back control to the original address must be done by setting this field to
	* the original address.
	*/
	rekeyTo;
	/**
	* Optional lease value to enforce mutual transaction exclusion.
	*
	* When a transaction with a non-empty lease field is confirmed, the lease is acquired.
	* A lease X is acquired by the sender, generating the (sender, X) lease.
	* The lease is kept active until the last_valid round of the transaction has elapsed.
	* No other transaction sent by the same sender can be confirmed until the lease expires.
	*/
	lease;
	/**
	* Optional group ID for atomic transaction grouping.
	*
	* Transactions with the same group ID must execute together or not at all.
	*/
	group;
	/**
	* Payment specific fields
	*/
	payment;
	/**
	* Asset transfer specific fields
	*/
	assetTransfer;
	/**
	* Asset config specific fields
	*/
	assetConfig;
	/**
	* App call specific fields
	*/
	appCall;
	/**
	* Key registration specific fields
	*/
	keyRegistration;
	/**
	* Asset freeze specific fields
	*/
	assetFreeze;
	/**
	* Heartbeat specific fields
	*/
	heartbeat;
	/**
	* State proof specific fields
	*/
	stateProof;
	constructor(params) {
		this[TXN_SYMBOL] = true;
		this.type = params.type;
		this.sender = params.sender;
		this.fee = params.fee;
		this.firstValid = params.firstValid;
		this.lastValid = params.lastValid;
		this.genesisHash = params.genesisHash;
		this.genesisId = params.genesisId;
		this.note = params.note;
		this.rekeyTo = params.rekeyTo;
		this.lease = params.lease;
		this.group = params.group;
		this.payment = params.payment;
		this.assetTransfer = params.assetTransfer;
		this.assetConfig = params.assetConfig;
		this.appCall = params.appCall;
		this.keyRegistration = params.keyRegistration;
		this.assetFreeze = params.assetFreeze;
		this.heartbeat = params.heartbeat;
		this.stateProof = params.stateProof;
	}
	rawTxId() {
		if (this.genesisHash === void 0) throw new Error("Cannot compute transaction id without genesis hash");
		return hash(encodeTransaction(this));
	}
	/**
	* Get the transaction ID as a base32-encoded string.
	*/
	txId() {
		const rawTxId = this.rawTxId();
		return import_base32.default.encode(rawTxId).slice(0, 52);
	}
};
Object.defineProperty(Transaction, Symbol.hasInstance, { value: function(obj) {
	if (obj instanceof Object && Object.getPrototypeOf(obj) === Transaction.prototype) return true;
	return Boolean(obj && typeof obj === "object" && TXN_SYMBOL in obj && obj[TXN_SYMBOL]);
} });
/**
* Codec for Transaction class.
* Handles encoding/decoding between Transaction class instances and wire format.
*/
var TransactionCodec = class extends Codec {
	defaultValue() {
		return new Transaction({
			type: TransactionType.Unknown,
			sender: Address.zeroAddress(),
			firstValid: 0n,
			lastValid: 0n
		});
	}
	toEncoded(value, format) {
		return transactionParamsCodec.encode({ ...value }, format);
	}
	fromEncoded(value, format) {
		return new Transaction(transactionParamsCodec.decode(value, format));
	}
	isDefaultValue(_) {
		return false;
	}
};
var transactionCodec = new TransactionCodec();
/**
* Encode the transaction with the domain separation (e.g. "TX") prefix
*
* @param transaction - The transaction to encode
* @returns The MsgPack encoded bytes or an error if encoding fails.
*/
function encodeTransaction(transaction) {
	const rawBytes = encodeTransactionRaw(transaction);
	return concatArrays(new TextEncoder().encode("TX"), rawBytes);
}
/**
* Encode the transaction without the domain separation (e.g. "TX") prefix
* This is useful for encoding the transaction for signing with tools that automatically add "TX" prefix to the transaction bytes.
*/
function encodeTransactionRaw(transaction) {
	return encodeMsgpack$1(transactionCodec.encode(transaction, "msgpack"));
}
/**
* Groups a collection of transactions by calculating and assigning the group to each transaction.
*/
function groupTransactions(transactions) {
	const group = computeGroup(transactions);
	return transactions.map((tx) => new Transaction({
		...tx,
		group
	}));
}
function computeGroup(transactions) {
	if (transactions.length === 0) throw new Error("Transaction group size cannot be 0");
	if (transactions.length > 16) throw new Error(`Transaction group size exceeds the max limit of 16`);
	const txHashes = transactions.map((tx) => {
		if (tx.group) throw new Error("Transactions must not already be grouped");
		return hash(encodeTransaction(tx));
	});
	return hash(concatArrays(new TextEncoder().encode("TG"), encodeMsgpack$1({ txlist: txHashes })));
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/transact/src/transactions/signed-transaction-meta.mjs
var MultisigSignatureMeta = {
	name: "MultisigSignature",
	kind: "object",
	fields: [
		{
			name: "version",
			wireKey: "v",
			optional: false,
			codec: numberCodec
		},
		{
			name: "threshold",
			wireKey: "thr",
			optional: false,
			codec: numberCodec
		},
		{
			name: "subsigs",
			wireKey: "subsig",
			optional: false,
			codec: new ArrayCodec(new ObjectModelCodec({
				name: "MultisigSubsignature",
				kind: "object",
				fields: [{
					name: "publicKey",
					wireKey: "pk",
					optional: false,
					codec: fixedBytes32Codec
				}, {
					name: "sig",
					wireKey: "s",
					optional: true,
					codec: fixedBytes64Codec
				}]
			}))
		}
	]
};
var LogicSigSignatureMeta = {
	name: "LogicSignature",
	kind: "object",
	fields: [
		{
			name: "logic",
			wireKey: "l",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "args",
			wireKey: "arg",
			optional: true,
			codec: bytesArrayCodec
		},
		{
			name: "sig",
			wireKey: "sig",
			optional: true,
			codec: fixedBytes64Codec
		},
		{
			name: "msig",
			wireKey: "msig",
			optional: true,
			codec: new ObjectModelCodec(MultisigSignatureMeta)
		},
		{
			name: "lmsig",
			wireKey: "lmsig",
			optional: true,
			codec: new ObjectModelCodec(MultisigSignatureMeta)
		}
	]
};
var multisigSignatureCodec = new ObjectModelCodec(MultisigSignatureMeta);
var logicSigSignatureCodec = new ObjectModelCodec(LogicSigSignatureMeta);
/**
* Metadata for SignedTransaction
*/
var SignedTransactionMeta = {
	name: "SignedTransaction",
	kind: "object",
	fields: [
		{
			name: "txn",
			wireKey: "txn",
			optional: false,
			codec: transactionCodec
		},
		{
			name: "sig",
			wireKey: "sig",
			optional: true,
			codec: fixedBytes64Codec
		},
		{
			name: "msig",
			wireKey: "msig",
			optional: true,
			codec: multisigSignatureCodec
		},
		{
			name: "lsig",
			wireKey: "lsig",
			optional: true,
			codec: logicSigSignatureCodec
		},
		{
			name: "authAddress",
			wireKey: "sgnr",
			optional: true,
			codec: addressCodec
		}
	]
};
var signedTransactionCodec = new ObjectModelCodec(SignedTransactionMeta);
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/bytes-base64.mjs
var BytesBase64Codec = class extends Codec {
	defaultValue() {
		return /* @__PURE__ */ new Uint8Array();
	}
	toEncoded(value, _format) {
		return Buffer$1.from(value).toString("base64");
	}
	fromEncoded(value, _format) {
		if (value instanceof Uint8Array) return new Uint8Array(Buffer$1.from(Buffer$1.from(value).toString("utf-8"), "base64"));
		if (typeof value === "string") return new Uint8Array(Buffer$1.from(value, "base64"));
		throw new Error(`Cannot decode bytes from ${typeof value}`);
	}
	isDefaultValue(value) {
		return value.byteLength === 0;
	}
};
var bytesBase64Codec = new BytesBase64Codec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/state-delta.mjs
var StateDeltaMeta$1 = {
	name: "StateDelta",
	kind: "array",
	codec: new ArrayCodec(new ObjectModelCodec({
		name: "EvalDeltaKeyValue",
		kind: "object",
		fields: [{
			name: "key",
			wireKey: "key",
			optional: false,
			codec: bytesBase64Codec
		}, {
			name: "value",
			wireKey: "value",
			optional: false,
			codec: new ObjectModelCodec({
				name: "EvalDelta",
				kind: "object",
				fields: [
					{
						name: "action",
						wireKey: "action",
						optional: false,
						codec: numberCodec
					},
					{
						name: "bytes",
						wireKey: "bytes",
						optional: true,
						codec: bytesBase64Codec
					},
					{
						name: "uint",
						wireKey: "uint",
						optional: true,
						codec: bigIntCodec
					}
				]
			})
		}]
	}))
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/account-state-delta.mjs
var AccountStateDeltaMeta$1 = {
	name: "AccountStateDelta",
	kind: "object",
	fields: [{
		name: "address",
		wireKey: "address",
		optional: false,
		codec: addressCodec
	}, {
		name: "delta",
		wireKey: "delta",
		optional: false,
		codec: new ArrayModelCodec(StateDeltaMeta$1)
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/pending-transaction-response.mjs
var PendingTransactionResponseMeta = {
	name: "PendingTransactionResponse",
	kind: "object",
	fields: [
		{
			name: "assetId",
			wireKey: "asset-index",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "appId",
			wireKey: "application-index",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "closeRewards",
			wireKey: "close-rewards",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "closingAmount",
			wireKey: "closing-amount",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "assetClosingAmount",
			wireKey: "asset-closing-amount",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "confirmedRound",
			wireKey: "confirmed-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "poolError",
			wireKey: "pool-error",
			optional: false,
			codec: stringCodec
		},
		{
			name: "receiverRewards",
			wireKey: "receiver-rewards",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "senderRewards",
			wireKey: "sender-rewards",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "localStateDelta",
			wireKey: "local-state-delta",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(AccountStateDeltaMeta$1))
		},
		{
			name: "globalStateDelta",
			wireKey: "global-state-delta",
			optional: true,
			codec: new ArrayModelCodec(StateDeltaMeta$1)
		},
		{
			name: "logs",
			wireKey: "logs",
			optional: true,
			codec: bytesArrayCodec
		},
		{
			name: "innerTxns",
			wireKey: "inner-txns",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(() => PendingTransactionResponseMeta))
		},
		{
			name: "txn",
			wireKey: "txn",
			optional: false,
			codec: new ObjectModelCodec(SignedTransactionMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/application-state-operation.mjs
var ApplicationStateOperationMeta = {
	name: "ApplicationStateOperation",
	kind: "object",
	fields: [
		{
			name: "operation",
			wireKey: "operation",
			optional: false,
			codec: stringCodec
		},
		{
			name: "appStateType",
			wireKey: "app-state-type",
			optional: false,
			codec: stringCodec
		},
		{
			name: "key",
			wireKey: "key",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "newValue",
			wireKey: "new-value",
			optional: true,
			codec: new ObjectModelCodec(AvmValueMeta)
		},
		{
			name: "account",
			wireKey: "account",
			optional: true,
			codec: addressCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/scratch-change.mjs
var ScratchChangeMeta = {
	name: "ScratchChange",
	kind: "object",
	fields: [{
		name: "slot",
		wireKey: "slot",
		optional: false,
		codec: numberCodec
	}, {
		name: "newValue",
		wireKey: "new-value",
		optional: false,
		codec: new ObjectModelCodec(AvmValueMeta)
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulation-opcode-trace-unit.mjs
var SimulationOpcodeTraceUnitMeta = {
	name: "SimulationOpcodeTraceUnit",
	kind: "object",
	fields: [
		{
			name: "pc",
			wireKey: "pc",
			optional: false,
			codec: numberCodec
		},
		{
			name: "scratchChanges",
			wireKey: "scratch-changes",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(ScratchChangeMeta))
		},
		{
			name: "stateChanges",
			wireKey: "state-changes",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(ApplicationStateOperationMeta))
		},
		{
			name: "spawnedInners",
			wireKey: "spawned-inners",
			optional: true,
			codec: numberArrayCodec
		},
		{
			name: "stackPopCount",
			wireKey: "stack-pop-count",
			optional: true,
			codec: numberCodec
		},
		{
			name: "stackAdditions",
			wireKey: "stack-additions",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(AvmValueMeta))
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulation-transaction-exec-trace.mjs
var SimulationTransactionExecTraceMeta = {
	name: "SimulationTransactionExecTrace",
	kind: "object",
	fields: [
		{
			name: "approvalProgramTrace",
			wireKey: "approval-program-trace",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(SimulationOpcodeTraceUnitMeta))
		},
		{
			name: "approvalProgramHash",
			wireKey: "approval-program-hash",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "clearStateProgramTrace",
			wireKey: "clear-state-program-trace",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(SimulationOpcodeTraceUnitMeta))
		},
		{
			name: "clearStateProgramHash",
			wireKey: "clear-state-program-hash",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "clearStateRollback",
			wireKey: "clear-state-rollback",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "clearStateRollbackError",
			wireKey: "clear-state-rollback-error",
			optional: true,
			codec: stringCodec
		},
		{
			name: "logicSigTrace",
			wireKey: "logic-sig-trace",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(SimulationOpcodeTraceUnitMeta))
		},
		{
			name: "logicSigHash",
			wireKey: "logic-sig-hash",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "innerTrace",
			wireKey: "inner-trace",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(() => SimulationTransactionExecTraceMeta))
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulate-transaction-group-result.mjs
var SimulateTransactionGroupResultMeta = {
	name: "SimulateTransactionGroupResult",
	kind: "object",
	fields: [
		{
			name: "txnResults",
			wireKey: "txn-results",
			optional: false,
			codec: new ArrayCodec(new ObjectModelCodec({
				name: "SimulateTransactionResult",
				kind: "object",
				fields: [
					{
						name: "txnResult",
						wireKey: "txn-result",
						optional: false,
						codec: new ObjectModelCodec(PendingTransactionResponseMeta)
					},
					{
						name: "appBudgetConsumed",
						wireKey: "app-budget-consumed",
						optional: true,
						codec: numberCodec
					},
					{
						name: "logicSigBudgetConsumed",
						wireKey: "logic-sig-budget-consumed",
						optional: true,
						codec: numberCodec
					},
					{
						name: "execTrace",
						wireKey: "exec-trace",
						optional: true,
						codec: new ObjectModelCodec(SimulationTransactionExecTraceMeta)
					},
					{
						name: "unnamedResourcesAccessed",
						wireKey: "unnamed-resources-accessed",
						optional: true,
						codec: new ObjectModelCodec(SimulateUnnamedResourcesAccessedMeta)
					},
					{
						name: "fixedSigner",
						wireKey: "fixed-signer",
						optional: true,
						codec: addressCodec
					}
				]
			}))
		},
		{
			name: "failureMessage",
			wireKey: "failure-message",
			optional: true,
			codec: stringCodec
		},
		{
			name: "failedAt",
			wireKey: "failed-at",
			optional: true,
			codec: numberArrayCodec
		},
		{
			name: "appBudgetAdded",
			wireKey: "app-budget-added",
			optional: true,
			codec: numberCodec
		},
		{
			name: "appBudgetConsumed",
			wireKey: "app-budget-consumed",
			optional: true,
			codec: numberCodec
		},
		{
			name: "unnamedResourcesAccessed",
			wireKey: "unnamed-resources-accessed",
			optional: true,
			codec: new ObjectModelCodec(SimulateUnnamedResourcesAccessedMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulation-eval-overrides.mjs
var SimulationEvalOverridesMeta = {
	name: "SimulationEvalOverrides",
	kind: "object",
	fields: [
		{
			name: "allowEmptySignatures",
			wireKey: "allow-empty-signatures",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "allowUnnamedResources",
			wireKey: "allow-unnamed-resources",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "maxLogCalls",
			wireKey: "max-log-calls",
			optional: true,
			codec: numberCodec
		},
		{
			name: "maxLogSize",
			wireKey: "max-log-size",
			optional: true,
			codec: numberCodec
		},
		{
			name: "extraOpcodeBudget",
			wireKey: "extra-opcode-budget",
			optional: true,
			codec: numberCodec
		},
		{
			name: "fixSigners",
			wireKey: "fix-signers",
			optional: true,
			codec: booleanCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/core/model-runtime.mjs
function encodeMsgpack(value, meta) {
	return encodeMsgpack$1(new ObjectModelCodec(meta).encode(value, "msgpack"));
}
function decodeJson(value, meta) {
	return new ObjectModelCodec(meta).decode(value, "json");
}
function decodeMsgpack(value, meta) {
	const wire = decodeMsgpack$1(value);
	return new ObjectModelCodec(meta).decode(wire, "msgpack");
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulate-response.mjs
var SimulateResponseMeta = {
	name: "SimulateResponse",
	kind: "object",
	fields: [
		{
			name: "version",
			wireKey: "version",
			optional: false,
			codec: numberCodec
		},
		{
			name: "lastRound",
			wireKey: "last-round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "txnGroups",
			wireKey: "txn-groups",
			optional: false,
			codec: new ArrayCodec(new ObjectModelCodec(SimulateTransactionGroupResultMeta))
		},
		{
			name: "evalOverrides",
			wireKey: "eval-overrides",
			optional: true,
			codec: new ObjectModelCodec(SimulationEvalOverridesMeta)
		},
		{
			name: "execTraceConfig",
			wireKey: "exec-trace-config",
			optional: true,
			codec: new ObjectModelCodec(SimulateTraceConfigMeta)
		},
		{
			name: "initialStates",
			wireKey: "initial-states",
			optional: true,
			codec: new ObjectModelCodec(SimulateInitialStatesMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/transact/src/transactions/signed-transaction.mjs
/**
* Decodes MsgPack bytes into a signed transaction.
*
* @param encodedSignedTransaction - The MsgPack encoded signed transaction bytes
* @returns The decoded SignedTransaction or an error if decoding fails.
*/
function decodeSignedTransaction(encodedSignedTransaction) {
	const decodedData = decodeMsgpack$1(encodedSignedTransaction);
	return signedTransactionCodec.decode(decodedData, "msgpack");
}
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/genesis.mjs
var GenesisMeta = {
	name: "Genesis",
	kind: "object",
	fields: [
		{
			name: "alloc",
			wireKey: "alloc",
			optional: false,
			codec: new ArrayCodec(new ObjectModelCodec({
				name: "GenesisAllocation",
				kind: "object",
				fields: [
					{
						name: "addr",
						wireKey: "addr",
						optional: false,
						codec: stringCodec
					},
					{
						name: "comment",
						wireKey: "comment",
						optional: false,
						codec: stringCodec
					},
					{
						name: "state",
						wireKey: "state",
						optional: false,
						codec: new ObjectModelCodec({
							name: "GenesisAllocationStateMeta",
							kind: "object",
							fields: [
								{
									name: "algo",
									wireKey: "algo",
									optional: false,
									codec: bigIntCodec
								},
								{
									name: "onl",
									wireKey: "onl",
									optional: false,
									codec: numberCodec
								},
								{
									name: "sel",
									wireKey: "sel",
									optional: true,
									codec: stringCodec
								},
								{
									name: "stprf",
									wireKey: "stprf",
									optional: true,
									codec: stringCodec
								},
								{
									name: "vote",
									wireKey: "vote",
									optional: true,
									codec: stringCodec
								},
								{
									name: "voteKd",
									wireKey: "voteKD",
									optional: true,
									codec: bigIntCodec
								},
								{
									name: "voteFst",
									wireKey: "voteFst",
									optional: true,
									codec: bigIntCodec
								},
								{
									name: "voteLst",
									wireKey: "voteLst",
									optional: true,
									codec: bigIntCodec
								}
							]
						})
					}
				]
			}))
		},
		{
			name: "comment",
			wireKey: "comment",
			optional: true,
			codec: stringCodec
		},
		{
			name: "devmode",
			wireKey: "devmode",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "fees",
			wireKey: "fees",
			optional: false,
			codec: stringCodec
		},
		{
			name: "id",
			wireKey: "id",
			optional: false,
			codec: stringCodec
		},
		{
			name: "network",
			wireKey: "network",
			optional: false,
			codec: stringCodec
		},
		{
			name: "proto",
			wireKey: "proto",
			optional: false,
			codec: stringCodec
		},
		{
			name: "rwd",
			wireKey: "rwd",
			optional: false,
			codec: stringCodec
		},
		{
			name: "timestamp",
			wireKey: "timestamp",
			optional: true,
			codec: numberCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/block.mjs
var BlockEvalDeltaMeta = {
	name: "BlockEvalDelta",
	kind: "object",
	fields: [
		{
			name: "action",
			wireKey: "at",
			optional: false,
			codec: numberCodec
		},
		{
			name: "bytes",
			wireKey: "bs",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "uint",
			wireKey: "ui",
			optional: true,
			codec: bigIntCodec
		}
	]
};
var BlockAppEvalDeltaMeta = {
	name: "BlockAppEvalDelta",
	kind: "object",
	fields: [
		{
			name: "globalDelta",
			wireKey: "gd",
			optional: true,
			codec: new MapCodec(bytesCodec, new ObjectModelCodec(BlockEvalDeltaMeta))
		},
		{
			name: "localDeltas",
			wireKey: "ld",
			optional: true,
			codec: new MapCodec(numberCodec, new MapCodec(bytesCodec, new ObjectModelCodec(BlockEvalDeltaMeta)))
		},
		{
			name: "innerTxns",
			wireKey: "itx",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(() => SignedTxnWithADMeta))
		},
		{
			name: "sharedAccounts",
			wireKey: "sa",
			optional: true,
			codec: addressArrayCodec
		},
		{
			name: "logs",
			wireKey: "lg",
			optional: true,
			codec: bytesArrayCodec
		}
	]
};
var BlockStateProofTrackingDataMeta = {
	name: "BlockStateProofTrackingData",
	kind: "object",
	fields: [
		{
			name: "stateProofVotersCommitment",
			wireKey: "v",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "stateProofOnlineTotalWeight",
			wireKey: "t",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "stateProofNextRound",
			wireKey: "n",
			optional: true,
			codec: bigIntCodec
		}
	]
};
var ApplyDataMeta = {
	name: "SignedTxnInBlock",
	kind: "object",
	fields: [
		{
			name: "closingAmount",
			wireKey: "ca",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "assetClosingAmount",
			wireKey: "aca",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "senderRewards",
			wireKey: "rs",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "receiverRewards",
			wireKey: "rr",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "closeRewards",
			wireKey: "rc",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "evalDelta",
			wireKey: "dt",
			optional: true,
			codec: new ObjectModelCodec(BlockAppEvalDeltaMeta)
		},
		{
			name: "configAsset",
			wireKey: "caid",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "applicationId",
			wireKey: "apid",
			optional: true,
			codec: bigIntCodec
		}
	]
};
var SignedTxnWithADMeta = {
	name: "SignedTxnWithAD",
	kind: "object",
	fields: [{
		name: "signedTxn",
		flattened: true,
		optional: false,
		codec: new ObjectModelCodec(SignedTransactionMeta)
	}, {
		name: "applyData",
		flattened: true,
		optional: true,
		codec: new ObjectModelCodec(ApplyDataMeta)
	}]
};
var SignedTxnInBlockMeta = {
	name: "SignedTxnInBlock",
	kind: "object",
	fields: [
		{
			name: "signedTxn",
			flattened: true,
			optional: false,
			codec: new ObjectModelCodec(SignedTxnWithADMeta)
		},
		{
			name: "hasGenesisId",
			wireKey: "hgi",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "hasGenesisHash",
			wireKey: "hgh",
			optional: true,
			codec: booleanCodec
		}
	]
};
var ParticipationUpdatesMeta$1 = {
	name: "ParticipationUpdates",
	kind: "object",
	fields: [{
		name: "expiredParticipationAccounts",
		wireKey: "partupdrmv",
		optional: false,
		codec: addressArrayCodec
	}, {
		name: "absentParticipationAccounts",
		wireKey: "partupdabs",
		optional: false,
		codec: addressArrayCodec
	}]
};
var TxnCommitmentsMeta = {
	name: "TxnCommitments",
	kind: "object",
	fields: [
		{
			name: "nativeSha512_256Commitment",
			wireKey: "txn",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "sha256Commitment",
			wireKey: "txn256",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "sha512Commitment",
			wireKey: "txn512",
			optional: true,
			codec: fixedBytes64Codec
		}
	]
};
var RewardStateMeta = {
	name: "RewardState",
	kind: "object",
	fields: [
		{
			name: "feeSink",
			wireKey: "fees",
			optional: false,
			codec: addressCodec
		},
		{
			name: "rewardsPool",
			wireKey: "rwd",
			optional: false,
			codec: addressCodec
		},
		{
			name: "rewardsLevel",
			wireKey: "earn",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "rewardsRate",
			wireKey: "rate",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "rewardsResidue",
			wireKey: "frac",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "rewardsRecalculationRound",
			wireKey: "rwcalr",
			optional: false,
			codec: bigIntCodec
		}
	]
};
var UpgradeStateMeta = {
	name: "UpgradeState",
	kind: "object",
	fields: [
		{
			name: "currentProtocol",
			wireKey: "proto",
			optional: false,
			codec: stringCodec
		},
		{
			name: "nextProtocol",
			wireKey: "nextproto",
			optional: true,
			codec: stringCodec
		},
		{
			name: "nextProtocolApprovals",
			wireKey: "nextyes",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "nextProtocolVoteBefore",
			wireKey: "nextbefore",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "nextProtocolSwitchOn",
			wireKey: "nextswitch",
			optional: true,
			codec: bigIntCodec
		}
	]
};
var UpgradeVoteMeta = {
	name: "UpgradeVote",
	kind: "object",
	fields: [
		{
			name: "upgradePropose",
			wireKey: "upgradeprop",
			optional: true,
			codec: stringCodec
		},
		{
			name: "upgradeDelay",
			wireKey: "upgradedelay",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "upgradeApprove",
			wireKey: "upgradeyes",
			optional: true,
			codec: booleanCodec
		}
	]
};
var BlockMeta$1 = {
	name: "Block",
	kind: "object",
	fields: [{
		name: "header",
		flattened: true,
		optional: false,
		codec: new ObjectModelCodec({
			name: "BlockHeader",
			kind: "object",
			fields: [
				{
					name: "round",
					wireKey: "rnd",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "previousBlockHash",
					wireKey: "prev",
					optional: false,
					codec: fixedBytes32Codec
				},
				{
					name: "previousBlockHash512",
					wireKey: "prev512",
					optional: true,
					codec: fixedBytes64Codec
				},
				{
					name: "seed",
					wireKey: "seed",
					optional: false,
					codec: bytesCodec
				},
				{
					name: "txnCommitments",
					flattened: true,
					optional: false,
					codec: new ObjectModelCodec(TxnCommitmentsMeta)
				},
				{
					name: "timestamp",
					wireKey: "ts",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "genesisId",
					wireKey: "gen",
					optional: false,
					codec: stringCodec
				},
				{
					name: "genesisHash",
					wireKey: "gh",
					optional: false,
					codec: fixedBytes32Codec
				},
				{
					name: "proposer",
					wireKey: "prp",
					optional: true,
					codec: addressCodec
				},
				{
					name: "feesCollected",
					wireKey: "fc",
					optional: true,
					codec: bigIntCodec
				},
				{
					name: "bonus",
					wireKey: "bi",
					optional: true,
					codec: bigIntCodec
				},
				{
					name: "proposerPayout",
					wireKey: "pp",
					optional: true,
					codec: bigIntCodec
				},
				{
					name: "rewardState",
					flattened: true,
					optional: false,
					codec: new ObjectModelCodec(RewardStateMeta)
				},
				{
					name: "upgradeState",
					flattened: true,
					optional: false,
					codec: new ObjectModelCodec(UpgradeStateMeta)
				},
				{
					name: "upgradeVote",
					flattened: true,
					optional: true,
					codec: new ObjectModelCodec(UpgradeVoteMeta)
				},
				{
					name: "txnCounter",
					wireKey: "tc",
					optional: true,
					codec: bigIntCodec
				},
				{
					name: "stateProofTracking",
					wireKey: "spt",
					optional: true,
					codec: new MapCodec(numberCodec, new ObjectModelCodec(BlockStateProofTrackingDataMeta))
				},
				{
					name: "participationUpdates",
					flattened: true,
					optional: false,
					codec: new ObjectModelCodec(ParticipationUpdatesMeta$1)
				}
			]
		})
	}, {
		name: "payset",
		wireKey: "txns",
		optional: false,
		codec: new ArrayCodec(new ObjectModelCodec(SignedTxnInBlockMeta))
	}]
};
/**
* Custom codec for Block that populates genesis information on transactions after decoding.
*
* When blocks are returned from algod, transactions may not include the genesisId
* and genesisHash fields even though they are required for correct transaction ID calculation.
* The block contains `hasGenesisId` and `hasGenesisHash` flags that indicate whether these
* fields should be populated from the block header.
*
* This codec automatically populates these fields after decoding to ensure transaction IDs
* can be calculated correctly.
*/
var BlockCodec = class extends ObjectModelCodec {
	constructor() {
		super(BlockMeta$1);
	}
	fromEncoded(value, format) {
		const block = super.fromEncoded(value, format);
		const genesisId = block.header.genesisId;
		const genesisHash = block.header.genesisHash;
		for (const txnInBlock of block.payset ?? []) {
			const txn = txnInBlock.signedTxn.signedTxn.txn;
			if (txnInBlock.hasGenesisId && txn.genesisId === void 0) txn.genesisId = genesisId;
			if (txnInBlock.hasGenesisHash !== false && txn.genesisHash === void 0) txn.genesisHash = genesisHash;
		}
		return block;
	}
};
var blockCodec = new BlockCodec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/ledger-state-delta.mjs
var LedgerTealValueMeta = {
	name: "LedgerTealValue",
	kind: "object",
	fields: [
		{
			name: "type",
			wireKey: "tt",
			optional: false,
			codec: numberCodec
		},
		{
			name: "bytes",
			wireKey: "tb",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "uint",
			wireKey: "ui",
			optional: true,
			codec: bigIntCodec
		}
	]
};
var LedgerStateSchemaMeta = {
	name: "LedgerStateSchema",
	kind: "object",
	fields: [{
		name: "numUints",
		wireKey: "nui",
		optional: true,
		codec: bigIntCodec
	}, {
		name: "numByteSlices",
		wireKey: "nbs",
		optional: true,
		codec: bigIntCodec
	}]
};
var LedgerAppParamsMeta = {
	name: "LedgerAppParams",
	kind: "object",
	fields: [
		{
			name: "approvalProgram",
			wireKey: "approv",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "clearStateProgram",
			wireKey: "clearp",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "localStateSchema",
			wireKey: "lsch",
			optional: false,
			codec: new ObjectModelCodec(LedgerStateSchemaMeta)
		},
		{
			name: "globalStateSchema",
			wireKey: "gsch",
			optional: false,
			codec: new ObjectModelCodec(LedgerStateSchemaMeta)
		},
		{
			name: "extraProgramPages",
			wireKey: "epp",
			optional: false,
			codec: numberCodec
		},
		{
			name: "version",
			wireKey: "v",
			optional: true,
			codec: numberCodec
		},
		{
			name: "sizeSponsor",
			wireKey: "ss",
			optional: true,
			codec: addressCodec
		},
		{
			name: "globalState",
			wireKey: "gs",
			optional: true,
			codec: new MapCodec(bytesCodec, new ObjectModelCodec(LedgerTealValueMeta))
		}
	]
};
var LedgerAppLocalStateMeta = {
	name: "LedgerAppLocalState",
	kind: "object",
	fields: [{
		name: "schema",
		wireKey: "hsch",
		optional: false,
		codec: new ObjectModelCodec(LedgerStateSchemaMeta)
	}, {
		name: "keyValue",
		wireKey: "tkv",
		optional: true,
		codec: new MapCodec(bytesCodec, new ObjectModelCodec(LedgerTealValueMeta))
	}]
};
var LedgerAppLocalStateDeltaMeta = {
	name: "LedgerAppLocalStateDelta",
	kind: "object",
	fields: [{
		name: "deleted",
		wireKey: "Deleted",
		optional: false,
		codec: booleanCodec
	}, {
		name: "localState",
		wireKey: "LocalState",
		optional: true,
		codec: new ObjectModelCodec(LedgerAppLocalStateMeta)
	}]
};
var LedgerAppParamsDeltaMeta = {
	name: "LedgerAppParamsDelta",
	kind: "object",
	fields: [{
		name: "deleted",
		wireKey: "Deleted",
		optional: false,
		codec: booleanCodec
	}, {
		name: "params",
		wireKey: "Params",
		optional: true,
		codec: new ObjectModelCodec(LedgerAppParamsMeta)
	}]
};
var LedgerAppResourceRecordMeta = {
	name: "LedgerAppResourceRecord",
	kind: "object",
	fields: [
		{
			name: "appId",
			wireKey: "Aidx",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "address",
			wireKey: "Addr",
			optional: false,
			codec: addressCodec
		},
		{
			name: "params",
			wireKey: "Params",
			optional: false,
			codec: new ObjectModelCodec(LedgerAppParamsDeltaMeta)
		},
		{
			name: "state",
			wireKey: "State",
			optional: false,
			codec: new ObjectModelCodec(LedgerAppLocalStateDeltaMeta)
		}
	]
};
var LedgerAssetHoldingDeltaMeta = {
	name: "LedgerAssetHoldingDelta",
	kind: "object",
	fields: [{
		name: "deleted",
		wireKey: "Deleted",
		optional: false,
		codec: booleanCodec
	}, {
		name: "holding",
		wireKey: "Holding",
		optional: true,
		codec: new ObjectModelCodec({
			name: "LedgerAssetHolding",
			kind: "object",
			fields: [{
				name: "amount",
				wireKey: "a",
				optional: false,
				codec: bigIntCodec
			}, {
				name: "frozen",
				wireKey: "f",
				optional: false,
				codec: booleanCodec
			}]
		})
	}]
};
var LedgerAssetParamsDeltaMeta = {
	name: "LedgerAssetParamsDelta",
	kind: "object",
	fields: [{
		name: "deleted",
		wireKey: "Deleted",
		optional: false,
		codec: booleanCodec
	}, {
		name: "params",
		wireKey: "Params",
		optional: true,
		codec: new ObjectModelCodec({
			name: "LedgerAssetParams",
			kind: "object",
			fields: [
				{
					name: "total",
					wireKey: "t",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "decimals",
					wireKey: "dc",
					optional: false,
					codec: numberCodec
				},
				{
					name: "defaultFrozen",
					wireKey: "df",
					optional: false,
					codec: booleanCodec
				},
				{
					name: "unitName",
					wireKey: "un",
					optional: true,
					codec: stringCodec
				},
				{
					name: "assetName",
					wireKey: "an",
					optional: true,
					codec: stringCodec
				},
				{
					name: "url",
					wireKey: "au",
					optional: true,
					codec: stringCodec
				},
				{
					name: "metadataHash",
					wireKey: "am",
					optional: true,
					codec: bytesCodec
				},
				{
					name: "manager",
					wireKey: "m",
					optional: true,
					codec: addressCodec
				},
				{
					name: "reserve",
					wireKey: "r",
					optional: true,
					codec: addressCodec
				},
				{
					name: "freeze",
					wireKey: "f",
					optional: true,
					codec: addressCodec
				},
				{
					name: "clawback",
					wireKey: "c",
					optional: true,
					codec: addressCodec
				}
			]
		})
	}]
};
var LedgerAssetResourceRecordMeta = {
	name: "LedgerAssetResourceRecord",
	kind: "object",
	fields: [
		{
			name: "assetId",
			wireKey: "Aidx",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "address",
			wireKey: "Addr",
			optional: false,
			codec: addressCodec
		},
		{
			name: "params",
			wireKey: "Params",
			optional: false,
			codec: new ObjectModelCodec(LedgerAssetParamsDeltaMeta)
		},
		{
			name: "holding",
			wireKey: "Holding",
			optional: false,
			codec: new ObjectModelCodec(LedgerAssetHoldingDeltaMeta)
		}
	]
};
var LedgerVotingDataMeta = {
	name: "LedgerVotingData",
	kind: "object",
	fields: [
		{
			name: "voteId",
			wireKey: "VoteID",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "selectionId",
			wireKey: "SelectionID",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "stateProofId",
			wireKey: "StateProofID",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "voteFirstValid",
			wireKey: "VoteFirstValid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "voteLastValid",
			wireKey: "VoteLastValid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "voteKeyDilution",
			wireKey: "VoteKeyDilution",
			optional: false,
			codec: bigIntCodec
		}
	]
};
var LedgerAccountDataMeta = {
	name: "LedgerAccountData",
	kind: "object",
	fields: [{
		name: "accountBaseData",
		flattened: true,
		optional: false,
		codec: new ObjectModelCodec({
			name: "LedgerAccountBaseData",
			kind: "object",
			fields: [
				{
					name: "status",
					wireKey: "Status",
					optional: false,
					codec: numberCodec
				},
				{
					name: "microAlgos",
					wireKey: "MicroAlgos",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "rewardsBase",
					wireKey: "RewardsBase",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "rewardedMicroAlgos",
					wireKey: "RewardedMicroAlgos",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "authAddress",
					wireKey: "AuthAddr",
					optional: false,
					codec: addressCodec
				},
				{
					name: "incentiveEligible",
					wireKey: "IncentiveEligible",
					optional: false,
					codec: booleanCodec
				},
				{
					name: "totalAppSchema",
					wireKey: "TotalAppSchema",
					optional: false,
					codec: new ObjectModelCodec(LedgerStateSchemaMeta)
				},
				{
					name: "totalExtraAppPages",
					wireKey: "TotalExtraAppPages",
					optional: false,
					codec: numberCodec
				},
				{
					name: "totalAppParams",
					wireKey: "TotalAppParams",
					optional: false,
					codec: numberCodec
				},
				{
					name: "totalAppLocalStates",
					wireKey: "TotalAppLocalStates",
					optional: false,
					codec: numberCodec
				},
				{
					name: "totalAssetParams",
					wireKey: "TotalAssetParams",
					optional: false,
					codec: numberCodec
				},
				{
					name: "totalAssets",
					wireKey: "TotalAssets",
					optional: false,
					codec: numberCodec
				},
				{
					name: "totalBoxes",
					wireKey: "TotalBoxes",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "totalBoxBytes",
					wireKey: "TotalBoxBytes",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "lastProposed",
					wireKey: "LastProposed",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "lastHeartbeat",
					wireKey: "LastHeartbeat",
					optional: false,
					codec: bigIntCodec
				}
			]
		})
	}, {
		name: "votingData",
		flattened: true,
		optional: false,
		codec: new ObjectModelCodec(LedgerVotingDataMeta)
	}]
};
var LedgerAccountDeltasMeta = {
	name: "LedgerAccountDeltas",
	kind: "object",
	fields: [
		{
			name: "accounts",
			wireKey: "Accts",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec({
				name: "LedgerBalanceRecord",
				kind: "object",
				fields: [{
					name: "address",
					wireKey: "Addr",
					optional: false,
					codec: addressCodec
				}, {
					name: "accountData",
					flattened: true,
					optional: false,
					codec: new ObjectModelCodec(LedgerAccountDataMeta)
				}]
			}))
		},
		{
			name: "appResources",
			wireKey: "AppResources",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(LedgerAppResourceRecordMeta))
		},
		{
			name: "assetResources",
			wireKey: "AssetResources",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(LedgerAssetResourceRecordMeta))
		}
	]
};
var LedgerKvValueDeltaMeta = {
	name: "LedgerKvValueDelta",
	kind: "object",
	fields: [{
		name: "data",
		wireKey: "Data",
		optional: true,
		codec: bytesCodec
	}, {
		name: "oldData",
		wireKey: "OldData",
		optional: true,
		codec: bytesCodec
	}]
};
var LedgerIncludedTransactionsMeta = {
	name: "LedgerIncludedTransactions",
	kind: "object",
	fields: [{
		name: "lastValid",
		wireKey: "LastValid",
		optional: false,
		codec: bigIntCodec
	}, {
		name: "intra",
		wireKey: "Intra",
		optional: false,
		codec: numberCodec
	}]
};
var LedgerModifiedCreatableMeta = {
	name: "LedgerModifiedCreatable",
	kind: "object",
	fields: [
		{
			name: "creatableType",
			wireKey: "Ctype",
			optional: false,
			codec: numberCodec
		},
		{
			name: "created",
			wireKey: "Created",
			optional: false,
			codec: booleanCodec
		},
		{
			name: "creator",
			wireKey: "Creator",
			optional: false,
			codec: addressCodec
		},
		{
			name: "ndeltas",
			wireKey: "Ndeltas",
			optional: false,
			codec: numberCodec
		}
	]
};
var LedgerAlgoCountMeta = {
	name: "LedgerAlgoCount",
	kind: "object",
	fields: [{
		name: "money",
		wireKey: "mon",
		optional: false,
		codec: bigIntCodec
	}, {
		name: "rewardUnits",
		wireKey: "rwd",
		optional: false,
		codec: bigIntCodec
	}]
};
var LedgerAccountTotalsMeta = {
	name: "LedgerAccountTotals",
	kind: "object",
	fields: [
		{
			name: "online",
			wireKey: "online",
			optional: false,
			codec: new ObjectModelCodec(LedgerAlgoCountMeta)
		},
		{
			name: "offline",
			wireKey: "offline",
			optional: false,
			codec: new ObjectModelCodec(LedgerAlgoCountMeta)
		},
		{
			name: "notParticipating",
			wireKey: "notpart",
			optional: false,
			codec: new ObjectModelCodec(LedgerAlgoCountMeta)
		},
		{
			name: "rewardsLevel",
			wireKey: "rwdlvl",
			optional: false,
			codec: bigIntCodec
		}
	]
};
var LedgerStateDeltaMeta = {
	name: "LedgerStateDelta",
	kind: "object",
	fields: [
		{
			name: "accounts",
			wireKey: "Accts",
			optional: false,
			codec: new ObjectModelCodec(LedgerAccountDeltasMeta)
		},
		{
			name: "block",
			wireKey: "Hdr",
			optional: false,
			codec: blockCodec
		},
		{
			name: "stateProofNext",
			wireKey: "StateProofNext",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "prevTimestamp",
			wireKey: "PrevTimestamp",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "totals",
			wireKey: "Totals",
			optional: false,
			codec: new ObjectModelCodec(LedgerAccountTotalsMeta)
		},
		{
			name: "kvMods",
			wireKey: "KvMods",
			optional: true,
			codec: new MapCodec(bytesCodec, new ObjectModelCodec(LedgerKvValueDeltaMeta))
		},
		{
			name: "txIds",
			wireKey: "Txids",
			optional: true,
			codec: new MapCodec(bytesCodec, new ObjectModelCodec(LedgerIncludedTransactionsMeta))
		},
		{
			name: "creatables",
			wireKey: "Creatables",
			optional: true,
			codec: new MapCodec(numberCodec, new ObjectModelCodec(LedgerModifiedCreatableMeta))
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/application-state-schema.mjs
var ApplicationStateSchemaMeta$1 = {
	name: "ApplicationStateSchema",
	kind: "object",
	fields: [{
		name: "numUints",
		wireKey: "num-uint",
		optional: false,
		codec: numberCodec
	}, {
		name: "numByteSlices",
		wireKey: "num-byte-slice",
		optional: false,
		codec: numberCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/teal-key-value-store.mjs
var TealKeyValueStoreMeta$1 = {
	name: "TealKeyValueStore",
	kind: "array",
	codec: new ArrayCodec(new ObjectModelCodec({
		name: "TealKeyValue",
		kind: "object",
		fields: [{
			name: "key",
			wireKey: "key",
			optional: false,
			codec: bytesCodec
		}, {
			name: "value",
			wireKey: "value",
			optional: false,
			codec: new ObjectModelCodec({
				name: "TealValue",
				kind: "object",
				fields: [
					{
						name: "type",
						wireKey: "type",
						optional: false,
						codec: numberCodec
					},
					{
						name: "bytes",
						wireKey: "bytes",
						optional: false,
						codec: bytesCodec
					},
					{
						name: "uint",
						wireKey: "uint",
						optional: false,
						codec: bigIntCodec
					}
				]
			})
		}]
	}))
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/application-params.mjs
var ApplicationParamsMeta$1 = {
	name: "ApplicationParams",
	kind: "object",
	fields: [
		{
			name: "creator",
			wireKey: "creator",
			optional: false,
			codec: addressCodec
		},
		{
			name: "approvalProgram",
			wireKey: "approval-program",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "clearStateProgram",
			wireKey: "clear-state-program",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "extraProgramPages",
			wireKey: "extra-program-pages",
			optional: true,
			codec: numberCodec
		},
		{
			name: "localStateSchema",
			wireKey: "local-state-schema",
			optional: true,
			codec: new ObjectModelCodec(ApplicationStateSchemaMeta$1)
		},
		{
			name: "globalStateSchema",
			wireKey: "global-state-schema",
			optional: true,
			codec: new ObjectModelCodec(ApplicationStateSchemaMeta$1)
		},
		{
			name: "globalState",
			wireKey: "global-state",
			optional: true,
			codec: new ArrayModelCodec(TealKeyValueStoreMeta$1)
		},
		{
			name: "version",
			wireKey: "version",
			optional: true,
			codec: numberCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/application.mjs
var ApplicationMeta$1 = {
	name: "Application",
	kind: "object",
	fields: [{
		name: "id",
		wireKey: "id",
		optional: false,
		codec: bigIntCodec
	}, {
		name: "params",
		wireKey: "params",
		optional: false,
		codec: new ObjectModelCodec(ApplicationParamsMeta$1)
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/asset-params.mjs
var AssetParamsMeta$1 = {
	name: "AssetParams",
	kind: "object",
	fields: [
		{
			name: "clawback",
			wireKey: "clawback",
			optional: true,
			codec: stringCodec
		},
		{
			name: "creator",
			wireKey: "creator",
			optional: false,
			codec: stringCodec
		},
		{
			name: "decimals",
			wireKey: "decimals",
			optional: false,
			codec: numberCodec
		},
		{
			name: "defaultFrozen",
			wireKey: "default-frozen",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "freeze",
			wireKey: "freeze",
			optional: true,
			codec: stringCodec
		},
		{
			name: "manager",
			wireKey: "manager",
			optional: true,
			codec: stringCodec
		},
		{
			name: "metadataHash",
			wireKey: "metadata-hash",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "name",
			wireKey: "name",
			optional: true,
			codec: stringCodec
		},
		{
			name: "nameB64",
			wireKey: "name-b64",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "reserve",
			wireKey: "reserve",
			optional: true,
			codec: stringCodec
		},
		{
			name: "total",
			wireKey: "total",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "unitName",
			wireKey: "unit-name",
			optional: true,
			codec: stringCodec
		},
		{
			name: "unitNameB64",
			wireKey: "unit-name-b64",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "url",
			wireKey: "url",
			optional: true,
			codec: stringCodec
		},
		{
			name: "urlB64",
			wireKey: "url-b64",
			optional: true,
			codec: bytesCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/asset.mjs
var AssetMeta$1 = {
	name: "Asset",
	kind: "object",
	fields: [{
		name: "id",
		wireKey: "index",
		optional: false,
		codec: bigIntCodec
	}, {
		name: "params",
		wireKey: "params",
		optional: false,
		codec: new ObjectModelCodec(AssetParamsMeta$1)
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/account-participation.mjs
var AccountParticipationMeta$1 = {
	name: "AccountParticipation",
	kind: "object",
	fields: [
		{
			name: "selectionParticipationKey",
			wireKey: "selection-participation-key",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "voteFirstValid",
			wireKey: "vote-first-valid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "voteKeyDilution",
			wireKey: "vote-key-dilution",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "voteLastValid",
			wireKey: "vote-last-valid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "voteParticipationKey",
			wireKey: "vote-participation-key",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "stateProofKey",
			wireKey: "state-proof-key",
			optional: true,
			codec: fixedBytes64Codec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/application-local-state.mjs
var ApplicationLocalStateMeta$1 = {
	name: "ApplicationLocalState",
	kind: "object",
	fields: [
		{
			name: "id",
			wireKey: "id",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "schema",
			wireKey: "schema",
			optional: false,
			codec: new ObjectModelCodec(ApplicationStateSchemaMeta$1)
		},
		{
			name: "keyValue",
			wireKey: "key-value",
			optional: true,
			codec: new ArrayModelCodec(TealKeyValueStoreMeta$1)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/asset-holding.mjs
var AssetHoldingMeta$1 = {
	name: "AssetHolding",
	kind: "object",
	fields: [
		{
			name: "amount",
			wireKey: "amount",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "assetId",
			wireKey: "asset-id",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "isFrozen",
			wireKey: "is-frozen",
			optional: false,
			codec: booleanCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/account.mjs
var AccountMeta$1 = {
	name: "Account",
	kind: "object",
	fields: [
		{
			name: "address",
			wireKey: "address",
			optional: false,
			codec: addressCodec
		},
		{
			name: "amount",
			wireKey: "amount",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "minBalance",
			wireKey: "min-balance",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "amountWithoutPendingRewards",
			wireKey: "amount-without-pending-rewards",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "appsLocalState",
			wireKey: "apps-local-state",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(ApplicationLocalStateMeta$1))
		},
		{
			name: "totalAppsOptedIn",
			wireKey: "total-apps-opted-in",
			optional: false,
			codec: numberCodec
		},
		{
			name: "appsTotalSchema",
			wireKey: "apps-total-schema",
			optional: true,
			codec: new ObjectModelCodec(ApplicationStateSchemaMeta$1)
		},
		{
			name: "appsTotalExtraPages",
			wireKey: "apps-total-extra-pages",
			optional: true,
			codec: numberCodec
		},
		{
			name: "assets",
			wireKey: "assets",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(AssetHoldingMeta$1))
		},
		{
			name: "totalAssetsOptedIn",
			wireKey: "total-assets-opted-in",
			optional: false,
			codec: numberCodec
		},
		{
			name: "createdApps",
			wireKey: "created-apps",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(ApplicationMeta$1))
		},
		{
			name: "totalCreatedApps",
			wireKey: "total-created-apps",
			optional: false,
			codec: numberCodec
		},
		{
			name: "createdAssets",
			wireKey: "created-assets",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(AssetMeta$1))
		},
		{
			name: "totalCreatedAssets",
			wireKey: "total-created-assets",
			optional: false,
			codec: numberCodec
		},
		{
			name: "totalBoxes",
			wireKey: "total-boxes",
			optional: true,
			codec: numberCodec
		},
		{
			name: "totalBoxBytes",
			wireKey: "total-box-bytes",
			optional: true,
			codec: numberCodec
		},
		{
			name: "participation",
			wireKey: "participation",
			optional: true,
			codec: new ObjectModelCodec(AccountParticipationMeta$1)
		},
		{
			name: "incentiveEligible",
			wireKey: "incentive-eligible",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "pendingRewards",
			wireKey: "pending-rewards",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "rewardBase",
			wireKey: "reward-base",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "rewards",
			wireKey: "rewards",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "round",
			wireKey: "round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "status",
			wireKey: "status",
			optional: false,
			codec: stringCodec
		},
		{
			name: "sigType",
			wireKey: "sig-type",
			optional: true,
			codec: stringCodec
		},
		{
			name: "authAddr",
			wireKey: "auth-addr",
			optional: true,
			codec: addressCodec
		},
		{
			name: "lastProposed",
			wireKey: "last-proposed",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "lastHeartbeat",
			wireKey: "last-heartbeat",
			optional: true,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/simulate-request.mjs
var SimulateRequestMeta = {
	name: "SimulateRequest",
	kind: "object",
	fields: [
		{
			name: "txnGroups",
			wireKey: "txn-groups",
			optional: false,
			codec: new ArrayCodec(new ObjectModelCodec({
				name: "SimulateRequestTransactionGroup",
				kind: "object",
				fields: [{
					name: "txns",
					wireKey: "txns",
					optional: false,
					codec: new ArrayCodec(new ObjectModelCodec(SignedTransactionMeta))
				}]
			}))
		},
		{
			name: "round",
			wireKey: "round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "allowEmptySignatures",
			wireKey: "allow-empty-signatures",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "allowMoreLogging",
			wireKey: "allow-more-logging",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "allowUnnamedResources",
			wireKey: "allow-unnamed-resources",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "extraOpcodeBudget",
			wireKey: "extra-opcode-budget",
			optional: true,
			codec: numberCodec
		},
		{
			name: "execTraceConfig",
			wireKey: "exec-trace-config",
			optional: true,
			codec: new ObjectModelCodec(SimulateTraceConfigMeta)
		},
		{
			name: "fixSigners",
			wireKey: "fix-signers",
			optional: true,
			codec: booleanCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/box.mjs
var BoxMeta = {
	name: "Box",
	kind: "object",
	fields: [
		{
			name: "round",
			wireKey: "round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "name",
			wireKey: "name",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "value",
			wireKey: "value",
			optional: false,
			codec: bytesCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/version.mjs
var VersionMeta = {
	name: "Version",
	kind: "object",
	fields: [
		{
			name: "build",
			wireKey: "build",
			optional: false,
			codec: new ObjectModelCodec({
				name: "BuildVersion",
				kind: "object",
				fields: [
					{
						name: "branch",
						wireKey: "branch",
						optional: false,
						codec: stringCodec
					},
					{
						name: "buildNumber",
						wireKey: "build_number",
						optional: false,
						codec: numberCodec
					},
					{
						name: "channel",
						wireKey: "channel",
						optional: false,
						codec: stringCodec
					},
					{
						name: "commitHash",
						wireKey: "commit_hash",
						optional: false,
						codec: stringCodec
					},
					{
						name: "major",
						wireKey: "major",
						optional: false,
						codec: numberCodec
					},
					{
						name: "minor",
						wireKey: "minor",
						optional: false,
						codec: numberCodec
					}
				]
			})
		},
		{
			name: "genesisHashB64",
			wireKey: "genesis_hash_b64",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "genesisId",
			wireKey: "genesis_id",
			optional: false,
			codec: stringCodec
		},
		{
			name: "versions",
			wireKey: "versions",
			optional: false,
			codec: stringArrayCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/state-proof.mjs
var StateProofMeta = {
	name: "StateProof",
	kind: "object",
	fields: [{
		name: "message",
		wireKey: "Message",
		optional: false,
		codec: new ObjectModelCodec({
			name: "StateProofMessage",
			kind: "object",
			fields: [
				{
					name: "blockHeadersCommitment",
					wireKey: "BlockHeadersCommitment",
					optional: false,
					codec: bytesCodec
				},
				{
					name: "votersCommitment",
					wireKey: "VotersCommitment",
					optional: false,
					codec: bytesCodec
				},
				{
					name: "lnProvenWeight",
					wireKey: "LnProvenWeight",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "firstAttestedRound",
					wireKey: "FirstAttestedRound",
					optional: false,
					codec: bigIntCodec
				},
				{
					name: "lastAttestedRound",
					wireKey: "LastAttestedRound",
					optional: false,
					codec: bigIntCodec
				}
			]
		})
	}, {
		name: "stateProof",
		wireKey: "StateProof",
		optional: false,
		codec: bytesCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/light-block-header-proof.mjs
var LightBlockHeaderProofMeta = {
	name: "LightBlockHeaderProof",
	kind: "object",
	fields: [
		{
			name: "index",
			wireKey: "index",
			optional: false,
			codec: numberCodec
		},
		{
			name: "treedepth",
			wireKey: "treedepth",
			optional: false,
			codec: numberCodec
		},
		{
			name: "proof",
			wireKey: "proof",
			optional: false,
			codec: bytesCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/transaction-proof.mjs
var TransactionProofMeta = {
	name: "TransactionProof",
	kind: "object",
	fields: [
		{
			name: "proof",
			wireKey: "proof",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "stibhash",
			wireKey: "stibhash",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "treedepth",
			wireKey: "treedepth",
			optional: false,
			codec: numberCodec
		},
		{
			name: "idx",
			wireKey: "idx",
			optional: false,
			codec: numberCodec
		},
		{
			name: "hashtype",
			wireKey: "hashtype",
			optional: false,
			codec: stringCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/get-block-time-stamp-offset-response.mjs
var GetBlockTimeStampOffsetResponseMeta = {
	name: "GetBlockTimeStampOffsetResponse",
	kind: "object",
	fields: [{
		name: "offset",
		wireKey: "offset",
		optional: false,
		codec: numberCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/get-sync-round-response.mjs
var GetSyncRoundResponseMeta = {
	name: "GetSyncRoundResponse",
	kind: "object",
	fields: [{
		name: "round",
		wireKey: "round",
		optional: false,
		codec: bigIntCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/transaction-group-ledger-state-deltas-for-round-response.mjs
var TransactionGroupLedgerStateDeltasForRoundResponseMeta = {
	name: "TransactionGroupLedgerStateDeltasForRoundResponse",
	kind: "object",
	fields: [{
		name: "deltas",
		wireKey: "Deltas",
		optional: false,
		codec: new ArrayCodec(new ObjectModelCodec({
			name: "LedgerStateDeltaForTransactionGroup",
			kind: "object",
			fields: [{
				name: "delta",
				wireKey: "Delta",
				optional: false,
				codec: new ObjectModelCodec(LedgerStateDeltaMeta)
			}, {
				name: "ids",
				wireKey: "Ids",
				optional: false,
				codec: stringArrayCodec
			}]
		}))
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/account-asset-response.mjs
var AccountAssetResponseMeta = {
	name: "AccountAssetResponse",
	kind: "object",
	fields: [
		{
			name: "round",
			wireKey: "round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "assetHolding",
			wireKey: "asset-holding",
			optional: true,
			codec: new ObjectModelCodec(AssetHoldingMeta$1)
		},
		{
			name: "createdAsset",
			wireKey: "created-asset",
			optional: true,
			codec: new ObjectModelCodec(AssetParamsMeta$1)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/account-application-response.mjs
var AccountApplicationResponseMeta = {
	name: "AccountApplicationResponse",
	kind: "object",
	fields: [
		{
			name: "round",
			wireKey: "round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "appLocalState",
			wireKey: "app-local-state",
			optional: true,
			codec: new ObjectModelCodec(ApplicationLocalStateMeta$1)
		},
		{
			name: "createdApp",
			wireKey: "created-app",
			optional: true,
			codec: new ObjectModelCodec(ApplicationParamsMeta$1)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/composite/record.mjs
/**
* Record codec - for string-keyed objects with homogeneous values
*/
var RecordCodec = class extends Codec {
	constructor(valueCodec) {
		super();
		this.valueCodec = valueCodec;
	}
	defaultValue() {
		return {};
	}
	toEncoded(value, format) {
		const result = {};
		for (const [key, val] of Object.entries(value)) result[key] = this.valueCodec.encode(val, format);
		return result;
	}
	fromEncoded(value, format) {
		const result = {};
		if (value instanceof Map) for (const [_key, val] of value.entries()) {
			const keyType = typeof _key;
			if (keyType === "number" || keyType === "bigint") throw new Error(`RecordCodec received a non-string key of type ${keyType}`);
			const key = _key instanceof Uint8Array ? Buffer$1.from(_key).toString("utf-8") : String(_key);
			result[key] = this.valueCodec.decode(val, format);
		}
		else for (const [key, val] of Object.entries(value)) result[key] = this.valueCodec.decode(val, format);
		return result;
	}
	isDefaultValue(value) {
		return Object.keys(value).length === 0;
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/primitives/unknown.mjs
/**
* Unknown codec - passthrough for unknown/any types
* Converts Maps with Uint8Array keys to objects with string keys recursively
*/
var UnknownCodec = class extends Codec {
	textDecoder = new TextDecoder("utf-8", { fatal: true });
	recordCodec;
	arrayCodec;
	constructor() {
		super();
		this.recordCodec = new RecordCodec(this);
		this.arrayCodec = new ArrayCodec(this);
	}
	defaultValue() {}
	toEncoded(_value, _format) {
		throw new Error("UnknownCodec does not support encoding");
	}
	fromEncoded(value, format) {
		return this.processValue(value, format);
	}
	maybeDecodeAsUtf8(bytes) {
		try {
			if ((bytes.length === 58 || bytes.length === 32 || bytes.length === 64) && bytes.every((byte) => byte === 0)) return bytes;
			return this.textDecoder.decode(bytes);
		} catch {
			return bytes;
		}
	}
	/**
	* Recursively process unknown values, using various codecs where appropriate
	*/
	processValue(value, format) {
		if (value === null || value === void 0) return value;
		if (value instanceof Uint8Array) return this.maybeDecodeAsUtf8(value);
		if (typeof value === "bigint") return bigIntCodec.decode(value, format);
		if (typeof value === "number") return numberCodec.decode(value, format);
		if (typeof value === "string") return stringCodec.decode(value, format);
		if (typeof value === "boolean") return booleanCodec.decode(value, format);
		if (Array.isArray(value)) return this.arrayCodec.decode(value, format);
		if (value instanceof Map || typeof value === "object") return this.recordCodec.decode(value, format);
		return value;
	}
};
var unknownCodec = new UnknownCodec();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/block-response.mjs
var BlockResponseMeta = {
	name: "BlockResponse",
	kind: "object",
	fields: [{
		name: "block",
		wireKey: "block",
		optional: false,
		codec: blockCodec
	}, {
		name: "cert",
		wireKey: "cert",
		optional: true,
		codec: new RecordCodec(unknownCodec)
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/block-txids-response.mjs
var BlockTxidsResponseMeta = {
	name: "BlockTxidsResponse",
	kind: "object",
	fields: [{
		name: "blockTxIds",
		wireKey: "blockTxids",
		optional: false,
		codec: stringArrayCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/block-hash-response.mjs
var BlockHashResponseMeta = {
	name: "BlockHashResponse",
	kind: "object",
	fields: [{
		name: "blockHash",
		wireKey: "blockHash",
		optional: false,
		codec: stringCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/node-status-response.mjs
var NodeStatusResponseMeta = {
	name: "NodeStatusResponse",
	kind: "object",
	fields: [
		{
			name: "catchupTime",
			wireKey: "catchup-time",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "lastRound",
			wireKey: "last-round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "lastVersion",
			wireKey: "last-version",
			optional: false,
			codec: stringCodec
		},
		{
			name: "nextVersion",
			wireKey: "next-version",
			optional: false,
			codec: stringCodec
		},
		{
			name: "nextVersionRound",
			wireKey: "next-version-round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "nextVersionSupported",
			wireKey: "next-version-supported",
			optional: false,
			codec: booleanCodec
		},
		{
			name: "stoppedAtUnsupportedRound",
			wireKey: "stopped-at-unsupported-round",
			optional: false,
			codec: booleanCodec
		},
		{
			name: "timeSinceLastRound",
			wireKey: "time-since-last-round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "lastCatchpoint",
			wireKey: "last-catchpoint",
			optional: true,
			codec: stringCodec
		},
		{
			name: "catchpoint",
			wireKey: "catchpoint",
			optional: true,
			codec: stringCodec
		},
		{
			name: "catchpointTotalAccounts",
			wireKey: "catchpoint-total-accounts",
			optional: true,
			codec: numberCodec
		},
		{
			name: "catchpointProcessedAccounts",
			wireKey: "catchpoint-processed-accounts",
			optional: true,
			codec: numberCodec
		},
		{
			name: "catchpointVerifiedAccounts",
			wireKey: "catchpoint-verified-accounts",
			optional: true,
			codec: numberCodec
		},
		{
			name: "catchpointTotalKvs",
			wireKey: "catchpoint-total-kvs",
			optional: true,
			codec: numberCodec
		},
		{
			name: "catchpointProcessedKvs",
			wireKey: "catchpoint-processed-kvs",
			optional: true,
			codec: numberCodec
		},
		{
			name: "catchpointVerifiedKvs",
			wireKey: "catchpoint-verified-kvs",
			optional: true,
			codec: numberCodec
		},
		{
			name: "catchpointTotalBlocks",
			wireKey: "catchpoint-total-blocks",
			optional: true,
			codec: numberCodec
		},
		{
			name: "catchpointAcquiredBlocks",
			wireKey: "catchpoint-acquired-blocks",
			optional: true,
			codec: numberCodec
		},
		{
			name: "upgradeDelay",
			wireKey: "upgrade-delay",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "upgradeNodeVote",
			wireKey: "upgrade-node-vote",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "upgradeVotesRequired",
			wireKey: "upgrade-votes-required",
			optional: true,
			codec: numberCodec
		},
		{
			name: "upgradeVotes",
			wireKey: "upgrade-votes",
			optional: true,
			codec: numberCodec
		},
		{
			name: "upgradeYesVotes",
			wireKey: "upgrade-yes-votes",
			optional: true,
			codec: numberCodec
		},
		{
			name: "upgradeNoVotes",
			wireKey: "upgrade-no-votes",
			optional: true,
			codec: numberCodec
		},
		{
			name: "upgradeNextProtocolVoteBefore",
			wireKey: "upgrade-next-protocol-vote-before",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "upgradeVoteRounds",
			wireKey: "upgrade-vote-rounds",
			optional: true,
			codec: numberCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/pending-transactions-response.mjs
var PendingTransactionsResponseMeta = {
	name: "PendingTransactionsResponse",
	kind: "object",
	fields: [{
		name: "topTransactions",
		wireKey: "top-transactions",
		optional: false,
		codec: new ArrayCodec(new ObjectModelCodec(SignedTransactionMeta))
	}, {
		name: "totalTransactions",
		wireKey: "total-transactions",
		optional: false,
		codec: numberCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/post-transactions-response.mjs
var PostTransactionsResponseMeta = {
	name: "PostTransactionsResponse",
	kind: "object",
	fields: [{
		name: "txId",
		wireKey: "txId",
		optional: false,
		codec: stringCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/supply-response.mjs
var SupplyResponseMeta = {
	name: "SupplyResponse",
	kind: "object",
	fields: [
		{
			name: "currentRound",
			wireKey: "current_round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "onlineMoney",
			wireKey: "online-money",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "totalMoney",
			wireKey: "total-money",
			optional: false,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/transaction-parameters-response.mjs
var TransactionParametersResponseMeta = {
	name: "TransactionParametersResponse",
	kind: "object",
	fields: [
		{
			name: "consensusVersion",
			wireKey: "consensus-version",
			optional: false,
			codec: stringCodec
		},
		{
			name: "fee",
			wireKey: "fee",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "genesisHash",
			wireKey: "genesis-hash",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "genesisId",
			wireKey: "genesis-id",
			optional: false,
			codec: stringCodec
		},
		{
			name: "lastRound",
			wireKey: "last-round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "minFee",
			wireKey: "min-fee",
			optional: false,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/boxes-response.mjs
var BoxesResponseMeta$1 = {
	name: "BoxesResponse",
	kind: "object",
	fields: [{
		name: "boxes",
		wireKey: "boxes",
		optional: false,
		codec: new ArrayCodec(new ObjectModelCodec({
			name: "BoxDescriptor",
			kind: "object",
			fields: [{
				name: "name",
				wireKey: "name",
				optional: false,
				codec: bytesCodec
			}]
		}))
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/compile-response.mjs
var CompileResponseMeta = {
	name: "CompileResponse",
	kind: "object",
	fields: [
		{
			name: "hash",
			wireKey: "hash",
			optional: false,
			codec: stringCodec
		},
		{
			name: "result",
			wireKey: "result",
			optional: false,
			codec: stringCodec
		},
		{
			name: "sourcemap",
			wireKey: "sourcemap",
			optional: true,
			codec: new ObjectModelCodec({
				name: "SourceMap",
				kind: "object",
				fields: [
					{
						name: "version",
						wireKey: "version",
						optional: false,
						codec: numberCodec
					},
					{
						name: "sources",
						wireKey: "sources",
						optional: false,
						codec: stringArrayCodec
					},
					{
						name: "names",
						wireKey: "names",
						optional: false,
						codec: stringArrayCodec
					},
					{
						name: "mappings",
						wireKey: "mappings",
						optional: false,
						codec: stringCodec
					}
				]
			})
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/models/disassemble-response.mjs
var DisassembleResponseMeta = {
	name: "DisassembleResponse",
	kind: "object",
	fields: [{
		name: "result",
		wireKey: "result",
		optional: false,
		codec: stringCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/apis/api-service.mjs
var AlgodApi = class {
	constructor(httpRequest) {
		this.httpRequest = httpRequest;
	}
	mimeTypeFor(format) {
		return format === "json" ? "application/json" : format === "msgpack" ? "application/msgpack" : "text/plain";
	}
	/**
	* Given a specific account public key and application ID, this call returns the account's application local state and global state (AppLocalState and AppParams, if either exists). Global state will only be returned if the provided address is the application's creator.
	*/
	async accountApplicationInformation(address, applicationId) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/accounts/{address}/applications/{application-id}",
			path: {
				address,
				"application-id": applicationId
			},
			query: {},
			headers,
			body: void 0
		}), AccountApplicationResponseMeta);
	}
	/**
	* Given a specific account public key and asset ID, this call returns the account's asset holding and asset parameters (if either exist). Asset parameters will only be returned if the provided address is the asset's creator.
	*/
	async accountAssetInformation(address, assetId) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/accounts/{address}/assets/{asset-id}",
			path: {
				address,
				"asset-id": assetId
			},
			query: {},
			headers,
			body: void 0
		}), AccountAssetResponseMeta);
	}
	/**
	* Given a specific account public key, this call returns the account's status, balance and spendable amounts
	*/
	async accountInformation(address, params) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/accounts/{address}",
			path: { address },
			query: { exclude: params?.exclude },
			headers,
			body: void 0
		}), AccountMeta$1);
	}
	/**
	* Given an application ID and box name, it returns the round, box name, and value (each base64 encoded). Box names must be in the goal app call arg encoding form 'encoding:value'. For ints, use the form 'int:1234'. For raw bytes, use the form 'b64:A=='. For printable strings, use the form 'str:hello'. For addresses, use the form 'addr:XYZ...'.
	*/
	async _applicationBoxByName(applicationId, params) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/applications/{application-id}/box",
			path: { "application-id": applicationId },
			query: { name: params?.name },
			headers,
			body: void 0
		}), BoxMeta);
	}
	/**
	* Given an application ID, return all Box names. No particular ordering is guaranteed. Request fails when client or server-side configured limits prevent returning all Box names.
	*/
	async applicationBoxes(applicationId, params) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/applications/{application-id}/boxes",
			path: { "application-id": applicationId },
			query: { max: params?.max },
			headers,
			body: void 0
		}), BoxesResponseMeta$1);
	}
	/**
	* Given a application ID, it returns application information including creator, approval and clear programs, global and local schemas, and global state.
	*/
	async applicationById(applicationId) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/applications/{application-id}",
			path: { "application-id": applicationId },
			query: {},
			headers,
			body: void 0
		}), ApplicationMeta$1);
	}
	/**
	* Given a asset ID, it returns asset information including creator, name, total supply and special addresses.
	*/
	async assetById(assetId) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/assets/{asset-id}",
			path: { "asset-id": assetId },
			query: {},
			headers,
			body: void 0
		}), AssetMeta$1);
	}
	async block(round, params) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("msgpack");
		return decodeMsgpack(await this.httpRequest.request({
			method: "GET",
			url: "/v2/blocks/{round}",
			path: { round },
			query: {
				"header-only": params?.headerOnly,
				format: "msgpack"
			},
			headers,
			body: void 0
		}), BlockResponseMeta);
	}
	async blockHash(round) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/blocks/{round}/hash",
			path: { round },
			query: {},
			headers,
			body: void 0
		}), BlockHashResponseMeta);
	}
	/**
	* Gets the current timestamp offset.
	*/
	async blockTimeStampOffset() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/devmode/blocks/offset",
			path: {},
			query: {},
			headers,
			body: void 0
		}), GetBlockTimeStampOffsetResponseMeta);
	}
	async blockTxIds(round) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/blocks/{round}/txids",
			path: { round },
			query: {},
			headers,
			body: void 0
		}), BlockTxidsResponseMeta);
	}
	/**
	* Returns the entire genesis file in json.
	*/
	async genesis() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/genesis",
			path: {},
			query: {},
			headers,
			body: void 0
		}), GenesisMeta);
	}
	async healthCheck() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		await this.httpRequest.request({
			method: "GET",
			url: "/health",
			path: {},
			query: {},
			headers,
			body: void 0
		});
	}
	/**
	* Get ledger deltas for a round.
	*/
	async ledgerStateDelta(round) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("msgpack");
		return decodeMsgpack(await this.httpRequest.request({
			method: "GET",
			url: "/v2/deltas/{round}",
			path: { round },
			query: { format: "msgpack" },
			headers,
			body: void 0
		}), LedgerStateDeltaMeta);
	}
	/**
	* Get a ledger delta for a given transaction group.
	*/
	async ledgerStateDeltaForTransactionGroup(id) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("msgpack");
		return decodeMsgpack(await this.httpRequest.request({
			method: "GET",
			url: "/v2/deltas/txn/group/{id}",
			path: { id },
			query: { format: "msgpack" },
			headers,
			body: void 0
		}), LedgerStateDeltaMeta);
	}
	async lightBlockHeaderProof(round) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/blocks/{round}/lightheader/proof",
			path: { round },
			query: {},
			headers,
			body: void 0
		}), LightBlockHeaderProofMeta);
	}
	/**
	* Given a transaction ID of a recently submitted transaction, it returns information about it.  There are several cases when this might succeed:
	* - transaction committed (committed round > 0)
	* - transaction still in the pool (committed round = 0, pool error = "")
	* - transaction removed from pool due to error (committed round = 0, pool error != "")
	* Or the transaction may have happened sufficiently long ago that the node no longer remembers it, and this will return an error.
	*/
	async pendingTransactionInformation(txId) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("msgpack");
		return decodeMsgpack(await this.httpRequest.request({
			method: "GET",
			url: "/v2/transactions/pending/{txid}",
			path: { txid: txId },
			query: { format: "msgpack" },
			headers,
			body: void 0
		}), PendingTransactionResponseMeta);
	}
	/**
	* Get the list of pending transactions, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
	*/
	async pendingTransactions(params) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("msgpack");
		return decodeMsgpack(await this.httpRequest.request({
			method: "GET",
			url: "/v2/transactions/pending",
			path: {},
			query: {
				max: params?.max,
				format: "msgpack"
			},
			headers,
			body: void 0
		}), PendingTransactionsResponseMeta);
	}
	/**
	* Get the list of pending transactions by address, sorted by priority, in decreasing order, truncated at the end at MAX. If MAX = 0, returns all pending transactions.
	*/
	async pendingTransactionsByAddress(address, params) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("msgpack");
		return decodeMsgpack(await this.httpRequest.request({
			method: "GET",
			url: "/v2/accounts/{address}/transactions/pending",
			path: { address },
			query: {
				max: params?.max,
				format: "msgpack"
			},
			headers,
			body: void 0
		}), PendingTransactionsResponseMeta);
	}
	async _rawTransaction(body) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		const serializedBody = body ?? void 0;
		headers["Content-Type"] = "application/x-binary";
		return decodeJson(await this.httpRequest.request({
			method: "POST",
			url: "/v2/transactions",
			path: {},
			query: {},
			headers,
			body: serializedBody
		}), PostTransactionsResponseMeta);
	}
	async ready() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		await this.httpRequest.request({
			method: "GET",
			url: "/ready",
			path: {},
			query: {},
			headers,
			body: void 0
		});
	}
	/**
	* Sets the timestamp offset (seconds) for blocks in dev mode. Providing an offset of 0 will unset this value and try to use the real clock for the timestamp.
	*/
	async setBlockTimeStampOffset(offset) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		await this.httpRequest.request({
			method: "POST",
			url: "/v2/devmode/blocks/offset/{offset}",
			path: { offset },
			query: {},
			headers,
			body: void 0
		});
	}
	/**
	* Sets the minimum sync round on the ledger.
	*/
	async setSyncRound(round) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		await this.httpRequest.request({
			method: "POST",
			url: "/v2/ledger/sync/{round}",
			path: { round },
			query: {},
			headers,
			body: void 0
		});
	}
	async simulateTransactions(body) {
		const headers = {};
		const responseFormat = "msgpack";
		headers["Accept"] = this.mimeTypeFor(responseFormat);
		const bodyMeta = SimulateRequestMeta;
		const mediaType = this.mimeTypeFor(!bodyMeta ? "text" : responseFormat);
		if (mediaType) headers["Content-Type"] = mediaType;
		const serializedBody = body ? encodeMsgpack(body, bodyMeta) : void 0;
		return decodeMsgpack(await this.httpRequest.request({
			method: "POST",
			url: "/v2/transactions/simulate",
			path: {},
			query: { format: "msgpack" },
			headers,
			body: serializedBody
		}), SimulateResponseMeta);
	}
	async stateProof(round) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/stateproofs/{round}",
			path: { round },
			query: {},
			headers,
			body: void 0
		}), StateProofMeta);
	}
	async status() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/status",
			path: {},
			query: {},
			headers,
			body: void 0
		}), NodeStatusResponseMeta);
	}
	/**
	* Waits for a block to appear after round {round} and returns the node's status at the time. There is a 1 minute timeout, when reached the current status is returned regardless of whether or not it is the round after the given round.
	*/
	async statusAfterBlock(round) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/status/wait-for-block-after/{round}",
			path: { round },
			query: {},
			headers,
			body: void 0
		}), NodeStatusResponseMeta);
	}
	async supply() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/ledger/supply",
			path: {},
			query: {},
			headers,
			body: void 0
		}), SupplyResponseMeta);
	}
	/**
	* Gets the minimum sync round for the ledger.
	*/
	async syncRound() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/ledger/sync",
			path: {},
			query: {},
			headers,
			body: void 0
		}), GetSyncRoundResponseMeta);
	}
	/**
	* Given TEAL source code in plain text, return base64 encoded program bytes and base32 SHA512_256 hash of program bytes (Address style). This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
	*/
	async tealCompile(body, params) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		const mediaType = this.mimeTypeFor("text");
		if (mediaType) headers["Content-Type"] = mediaType;
		return decodeJson(await this.httpRequest.request({
			method: "POST",
			url: "/v2/teal/compile",
			path: {},
			query: { sourcemap: params?.sourcemap },
			headers,
			body
		}), CompileResponseMeta);
	}
	/**
	* Given the program bytes, return the TEAL source code in plain text. This endpoint is only enabled when a node's configuration file sets EnableDeveloperAPI to true.
	*/
	async tealDisassemble(body) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		const serializedBody = body ?? void 0;
		headers["Content-Type"] = "application/x-binary";
		return decodeJson(await this.httpRequest.request({
			method: "POST",
			url: "/v2/teal/disassemble",
			path: {},
			query: {},
			headers,
			body: serializedBody
		}), DisassembleResponseMeta);
	}
	/**
	* Get ledger deltas for transaction groups in a given round.
	*/
	async transactionGroupLedgerStateDeltasForRound(round) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("msgpack");
		return decodeMsgpack(await this.httpRequest.request({
			method: "GET",
			url: "/v2/deltas/{round}/txn/group",
			path: { round },
			query: { format: "msgpack" },
			headers,
			body: void 0
		}), TransactionGroupLedgerStateDeltasForRoundResponseMeta);
	}
	async _transactionParams() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/transactions/params",
			path: {},
			query: {},
			headers,
			body: void 0
		}), TransactionParametersResponseMeta);
	}
	async transactionProof(round, txId, params) {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/v2/blocks/{round}/transactions/{txid}/proof",
			path: {
				round,
				txid: txId
			},
			query: { hashtype: params?.hashtype },
			headers,
			body: void 0
		}), TransactionProofMeta);
	}
	/**
	* Unset the ledger sync round.
	*/
	async unsetSyncRound() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		await this.httpRequest.request({
			method: "DELETE",
			url: "/v2/ledger/sync",
			path: {},
			query: {},
			headers,
			body: void 0
		});
	}
	/**
	* Retrieves the supported API versions, binary build versions, and genesis information.
	*/
	async version() {
		const headers = {};
		headers["Accept"] = this.mimeTypeFor("json");
		return decodeJson(await this.httpRequest.request({
			method: "GET",
			url: "/versions",
			path: {},
			query: {},
			headers,
			body: void 0
		}), VersionMeta);
	}
	/**
	* Send a signed transaction or array of signed transactions to the network.
	*/
	async sendRawTransaction(stxOrStxs) {
		let rawTransactions = stxOrStxs;
		if (Array.isArray(stxOrStxs)) {
			if (!stxOrStxs.every((a) => a instanceof Uint8Array)) throw new Error("Array elements must be byte arrays");
			rawTransactions = concatArrays(...stxOrStxs);
		} else if (!(rawTransactions instanceof Uint8Array)) throw new Error("Argument must be byte array");
		return this._rawTransaction(rawTransactions);
	}
	/**
	* Given an application ID and box name, it returns the round, box name, and value.
	*/
	async applicationBoxByName(applicationId, boxName) {
		const name = `b64:${Buffer.from(boxName).toString("base64")}`;
		return this._applicationBoxByName(applicationId, { name });
	}
	/**
	* Returns the common needed parameters for a new transaction.
	*/
	async suggestedParams() {
		const txnParams = await this._transactionParams();
		return {
			flatFee: false,
			fee: txnParams.fee,
			firstValid: txnParams.lastRound,
			lastValid: txnParams.lastRound + 1000n,
			genesisHash: txnParams.genesisHash,
			genesisId: txnParams.genesisId,
			minFee: txnParams.minFee,
			consensusVersion: txnParams.consensusVersion
		};
	}
	/**
	* Returns the common needed parameters for a new transaction.
	*/
	async transactionParams() {
		return await this.suggestedParams();
	}
	/**
	* Simulate an encoded signed transaction or array of encoded signed transactions.
	*/
	async simulateRawTransactions(stxOrStxs) {
		const txns = Array.isArray(stxOrStxs) ? stxOrStxs.map((stxn) => decodeSignedTransaction(stxn)) : [decodeSignedTransaction(stxOrStxs)];
		return this.simulateTransactions({ txnGroups: [{ txns }] });
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/algod_client/src/client.mjs
var AlgodClient = class extends AlgodApi {
	constructor(config) {
		super(new FetchHttpRequest(config));
	}
};
Uint8Array.from([77, 88]);
new Uint8Array([
	77,
	117,
	108,
	116,
	105,
	115,
	105,
	103,
	65,
	100,
	100,
	114
]);
new TextEncoder().encode("Program");
new TextEncoder().encode("MsigProgram");
new TextEncoder().encode("ProgData");
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/common/src/codecs/models/primitive-model.mjs
var PrimitiveModelCodec = class extends Codec {
	resolvedMetadata = void 0;
	constructor(metadata) {
		super();
		this.metadata = metadata;
	}
	getMetadata() {
		if (!this.resolvedMetadata) this.resolvedMetadata = typeof this.metadata === "function" ? this.metadata() : this.metadata;
		return this.resolvedMetadata;
	}
	defaultValue() {
		return this.getMetadata().codec.defaultValue();
	}
	isDefaultValue(value) {
		return this.getMetadata().codec.isDefaultValue(value);
	}
	encode(value, format) {
		return this.getMetadata().codec.encode(value, format);
	}
	encodeOptional(value, format) {
		return this.getMetadata().codec.encodeOptional(value, format);
	}
	decode(value, format) {
		return this.getMetadata().codec.decode(value, format);
	}
	decodeOptional(value, format) {
		return this.getMetadata().codec.decodeOptional(value, format);
	}
};
//#endregion
//#region node_modules/@noble/ed25519/index.js
/*! noble-ed25519 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
/**
* 5KB JS implementation of ed25519 EdDSA signatures.
* Targets RFC8032, FIPS 186-5, and ZIP215 behavior.
* @module
* @example
* ```js
import * as ed from '@noble/ed25519';
(async () => {
const secretKey = ed.utils.randomSecretKey();
const message = Uint8Array.from([0xab, 0xbc, 0xcd, 0xde]);
const pubKey = await ed.getPublicKeyAsync(secretKey); // Sync methods are also present
const signature = await ed.signAsync(message, secretKey);
const isValid = await ed.verifyAsync(signature, message, pubKey);
})();
```
*/
/**
* Curve params. edwards25519 uses the RFC equation `-x² + y² = 1 + dx²y²`.
* The stored `a` literal below is `p - 1`, i.e. the field-element encoding of RFC `a = -1`.
* * P = `2n**255n - 19n` // field over which calculations are done
* * N = `2n**252n + 27742317777372353535851937790883648493n` // prime-order subgroup order
* * h = 8 // cofactor
* * a = `Fp.create(BigInt(-1))` // equation param, stored here as `p - 1`
* * d = -121665/121666 a.k.a. `Fp.neg(121665 * Fp.inv(121666))` // equation param
* * Gx, Gy are coordinates of Generator / base point
*
* Mirror noble-curves: Point.CURVE() exposes shared params, but callers must not be able to mutate
* that shared view and desynchronize it from the arithmetic constants captured below.
*/
var ed25519_CURVE$1 = Object.freeze({
	p: 57896044618658097711785492504343953926634992332820282019728792003956564819949n,
	n: 7237005577332262213973186563042994240857116359379907606001950938285454250989n,
	h: 8n,
	a: 57896044618658097711785492504343953926634992332820282019728792003956564819948n,
	d: 37095705934669439343138083508754565189542113879843219016388785533085940283555n,
	Gx: 15112221349535400772501151409588531511454012693041857206046113283949847762202n,
	Gy: 46316835694926478169428394003475163141307993866256225615783033603165251855960n
});
var { p: P, n: N, Gx, Gy, a: _a, d: _d, h } = ed25519_CURVE$1;
var L = 32;
var captureTrace = (...args) => {
	if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") Error.captureStackTrace(...args);
};
var err = (message = "") => {
	const e = new Error(message);
	captureTrace(e, err);
	throw e;
};
var isBig = (n) => typeof n === "bigint";
var isStr = (s) => typeof s === "string";
var isBytes$1 = (a) => a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
/**
* Asserts something is Bytes, optionally enforces exact length,
* and returns the same reference.
*/
var abytes$1 = (value, length, title = "") => {
	const bytes = isBytes$1(value);
	const len = value?.length;
	const needsLen = length !== void 0;
	if (!bytes || needsLen && len !== length) {
		const prefix = title && `"${title}" `;
		const ofLen = needsLen ? ` of length ${length}` : "";
		const got = bytes ? `length=${len}` : `type=${typeof value}`;
		const msg = prefix + "expected Uint8Array" + ofLen + ", got " + got;
		throw bytes ? new RangeError(msg) : new TypeError(msg);
	}
	return value;
};
/** create Uint8Array */
var u8n = (len) => new Uint8Array(len);
var u8fr = (buf) => Uint8Array.from(buf);
var padh = (n, pad) => n.toString(16).padStart(pad, "0");
var bytesToHex$1 = (b) => Array.from(abytes$1(b)).map((e) => padh(e, 2)).join("");
var C = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
var _ch = (ch) => {
	if (ch >= C._0 && ch <= C._9) return ch - C._0;
	if (ch >= C.A && ch <= C.F) return ch - (C.A - 10);
	if (ch >= C.a && ch <= C.f) return ch - (C.a - 10);
};
var hexToBytes$1 = (hex) => {
	const e = "hex invalid";
	if (!isStr(hex)) return err(e);
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) return err(e);
	const array = u8n(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = _ch(hex.charCodeAt(hi));
		const n2 = _ch(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) return err(e);
		array[ai] = n1 * 16 + n2;
	}
	return array;
};
var cr = () => globalThis?.crypto;
var subtle = () => cr()?.subtle ?? err("crypto.subtle must be defined, consider polyfill");
var concatBytes$1 = (...arrs) => {
	let len = 0;
	for (const a of arrs) len += abytes$1(a).length;
	const r = u8n(len);
	let pad = 0;
	arrs.forEach((a) => {
		r.set(a, pad);
		pad += a.length;
	});
	return r;
};
var big = BigInt;
/** Inclusive-lower, exclusive-upper bigint range assertion. */
var assertRange = (n, min, max, msg = "bad number: out of range") => {
	if (!isBig(n)) throw new TypeError(msg);
	if (min <= n && n < max) return n;
	throw new RangeError(msg);
};
/** Canonical modular reduction into `[0, b)`. */
var M = (a, b = P) => {
	const r = a % b;
	return r >= 0n ? r : b + r;
};
var P_MASK = (1n << 255n) - 1n;
var modP = (num) => {
	if (num < 0n) err("negative coordinate");
	let r = (num >> 255n) * 19n + (num & P_MASK);
	r = (r >> 255n) * 19n + (r & P_MASK);
	return r % P;
};
/** Modular inversion using Euclidean GCD (non-CT) instead of the RFC's `x^(p-2)` formulation.
* This still sits on secret-dependent paths like point normalization during keygen/signing. */
var invert$1 = (num, md) => {
	if (num === 0n || md <= 0n) err("no inverse n=" + num + " mod=" + md);
	let a = M(num, md), b = md, x = 0n, y = 1n, u = 1n, v = 0n;
	while (a !== 0n) {
		const q = b / a, r = b % a;
		const m = x - u * q, n = y - v * q;
		b = a, a = r, x = u, y = v, u = m, v = n;
	}
	return b === 1n ? M(x, md) : err("no inverse");
};
var apoint = (p) => p instanceof Point ? p : err("Point expected");
var B256 = 2n ** 256n;
/**
* Point in XYZT extended coordinates.
* @param X - X coordinate.
* @param Y - Y coordinate.
* @param Z - Projective Z coordinate.
* @param T - Cached cross-product term.
* @example
* Do point arithmetic with the built-in base point and encode the result as hex.
*
* ```ts
* const hex = Point.BASE.double().toHex();
* ```
*/
var Point = class Point {
	static BASE;
	static ZERO;
	X;
	Y;
	Z;
	T;
	constructor(X, Y, Z, T) {
		const max = B256;
		this.X = assertRange(X, 0n, max);
		this.Y = assertRange(Y, 0n, max);
		this.Z = assertRange(Z, 1n, max);
		this.T = assertRange(T, 0n, max);
		Object.freeze(this);
	}
	static CURVE() {
		return ed25519_CURVE$1;
	}
	static fromAffine(p) {
		return new Point(p.x, p.y, 1n, modP(p.x * p.y));
	}
	/** RFC8032 5.1.3: Bytes to Point. */
	static fromBytes(hex, zip215 = false) {
		const d = _d;
		const normed = u8fr(abytes$1(hex, L));
		const lastByte = hex[31];
		normed[31] = lastByte & -129;
		const y = bytesToNumberLE$1(normed);
		assertRange(y, 0n, zip215 ? B256 : P);
		const y2 = modP(y * y);
		let { isValid, value: x } = uvRatio$1(M(y2 - 1n), modP(d * y2 + 1n));
		if (!isValid) err("bad point: y not sqrt");
		const isXOdd = (x & 1n) === 1n;
		const isLastByteOdd = (lastByte & 128) !== 0;
		if (!zip215 && x === 0n && isLastByteOdd) err("bad point: x==0, isLastByteOdd");
		if (isLastByteOdd !== isXOdd) x = M(-x);
		return new Point(x, y, 1n, modP(x * y));
	}
	static fromHex(hex, zip215) {
		return Point.fromBytes(hexToBytes$1(hex), zip215);
	}
	get x() {
		return this.toAffine().x;
	}
	get y() {
		return this.toAffine().y;
	}
	/** Checks if the point is valid and on-curve. */
	assertValidity() {
		const a = _a;
		const d = _d;
		const p = this;
		if (p.is0()) return err("bad point: ZERO");
		const { X, Y, Z, T } = p;
		const X2 = modP(X * X);
		const Y2 = modP(Y * Y);
		const Z2 = modP(Z * Z);
		const Z4 = modP(Z2 * Z2);
		if (modP(Z2 * (modP(X2 * a) + Y2)) !== M(Z4 + modP(d * modP(X2 * Y2)))) return err("bad point: equation left != right (1)");
		if (modP(X * Y) !== modP(Z * T)) return err("bad point: equation left != right (2)");
		return this;
	}
	/** Equality check: compare points P&Q. */
	equals(other) {
		const { X: X1, Y: Y1, Z: Z1 } = this;
		const { X: X2, Y: Y2, Z: Z2 } = apoint(other);
		const X1Z2 = modP(X1 * Z2);
		const X2Z1 = modP(X2 * Z1);
		const Y1Z2 = modP(Y1 * Z2);
		const Y2Z1 = modP(Y2 * Z1);
		return X1Z2 === X2Z1 && Y1Z2 === Y2Z1;
	}
	is0() {
		return this.equals(I);
	}
	/** Flip point over y coordinate. */
	negate() {
		return new Point(M(-this.X), this.Y, this.Z, M(-this.T));
	}
	/** Point doubling. Complete formula. Cost: `4M + 4S + 1*a + 6add + 1*2`. */
	double() {
		const { X: X1, Y: Y1, Z: Z1 } = this;
		const a = _a;
		const A = modP(X1 * X1);
		const B = modP(Y1 * Y1);
		const C = modP(2n * Z1 * Z1);
		const D = modP(a * A);
		const x1y1 = M(X1 + Y1);
		const E = M(modP(x1y1 * x1y1) - A - B);
		const G = M(D + B);
		const F = M(G - C);
		const H = M(D - B);
		const X3 = modP(E * F);
		const Y3 = modP(G * H);
		const T3 = modP(E * H);
		const Z3 = modP(F * G);
		return new Point(X3, Y3, Z3, T3);
	}
	/** Point addition. Complete formula. Cost: `8M + 1*k + 8add + 1*2`. */
	add(other) {
		const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
		const { X: X2, Y: Y2, Z: Z2, T: T2 } = apoint(other);
		const a = _a;
		const d = _d;
		const A = modP(X1 * X2);
		const B = modP(Y1 * Y2);
		const C = modP(modP(T1 * d) * T2);
		const D = modP(Z1 * Z2);
		const E = M(modP(M(X1 + Y1) * M(X2 + Y2)) - A - B);
		const F = M(D - C);
		const G = M(D + C);
		const H = M(B - modP(a * A));
		const X3 = modP(E * F);
		const Y3 = modP(G * H);
		const T3 = modP(E * H);
		const Z3 = modP(F * G);
		return new Point(X3, Y3, Z3, T3);
	}
	subtract(other) {
		return this.add(apoint(other).negate());
	}
	/**
	* Point-by-scalar multiplication. Safe mode requires `1 <= n < CURVE.n`.
	* Unsafe mode additionally permits `n = 0` and returns the identity point for that case.
	* Uses {@link wNAF} for base point.
	* Uses fake point to mitigate side-channel leakage.
	* @param n - scalar by which point is multiplied
	* @param safe - safe mode guards against timing attacks; unsafe mode is faster
	*/
	multiply(n, safe = true) {
		if (!safe && n === 0n) return I;
		assertRange(n, 1n, N);
		if (!safe && this.is0()) return I;
		if (n === 1n) return this;
		if (this.equals(G)) return wNAF(n).p;
		let p = I;
		let f = G;
		for (let d = this; n > 0n; d = d.double(), n >>= 1n) if (n & 1n) p = p.add(d);
		else if (safe) f = f.add(d);
		return p;
	}
	multiplyUnsafe(scalar) {
		return this.multiply(scalar, false);
	}
	/** Convert point to 2d xy affine point. (X, Y, Z) ∋ (x=X/Z, y=Y/Z) */
	toAffine() {
		const { X, Y, Z } = this;
		if (this.equals(I)) return {
			x: 0n,
			y: 1n
		};
		const iz = invert$1(Z, P);
		if (modP(Z * iz) !== 1n) err("invalid inverse");
		return {
			x: modP(X * iz),
			y: modP(Y * iz)
		};
	}
	toBytes() {
		const { x, y } = this.toAffine();
		const b = numTo32bLE(y);
		b[31] |= x & 1n ? 128 : 0;
		return b;
	}
	toHex() {
		return bytesToHex$1(this.toBytes());
	}
	clearCofactor() {
		return this.multiply(big(h), false);
	}
	isSmallOrder() {
		return this.clearCofactor().is0();
	}
	isTorsionFree() {
		let p = this.multiply(N / 2n, false).double();
		if (N % 2n) p = p.add(this);
		return p.is0();
	}
};
/** Generator / base point */
var G = new Point(Gx, Gy, 1n, M(Gx * Gy));
/** Identity / zero point */
var I = new Point(0n, 1n, 1n, 0n);
Point.BASE = G;
Point.ZERO = I;
var numTo32bLE = (num) => hexToBytes$1(padh(assertRange(num, 0n, B256), 64)).reverse();
var bytesToNumberLE$1 = (b) => big("0x" + bytesToHex$1(u8fr(abytes$1(b)).reverse()));
var pow2$1 = (x, power) => {
	let r = x;
	while (power-- > 0n) r = modP(r * r);
	return r;
};
var pow_2_252_3 = (x) => {
	const b2 = modP(modP(x * x) * x);
	const b5 = modP(pow2$1(modP(pow2$1(b2, 2n) * b2), 1n) * x);
	const b10 = modP(pow2$1(b5, 5n) * b5);
	const b20 = modP(pow2$1(b10, 10n) * b10);
	const b40 = modP(pow2$1(b20, 20n) * b20);
	const b80 = modP(pow2$1(b40, 40n) * b40);
	return {
		pow_p_5_8: modP(pow2$1(modP(pow2$1(modP(pow2$1(modP(pow2$1(b80, 80n) * b80), 80n) * b80), 10n) * b10), 2n) * x),
		b2
	};
};
var RM1 = 19681161376707505956807079304988542015446066515923890162744021073123829784752n;
var uvRatio$1 = (u, v) => {
	const v3 = modP(v * modP(v * v));
	const pow = pow_2_252_3(modP(u * modP(modP(v3 * v3) * v))).pow_p_5_8;
	let x = modP(u * modP(v3 * pow));
	const vx2 = modP(v * modP(x * x));
	const root1 = x;
	const root2 = modP(x * RM1);
	const useRoot1 = vx2 === u;
	const useRoot2 = vx2 === M(-u);
	const noRoot = vx2 === M(-u * RM1);
	if (useRoot1) x = root1;
	if (useRoot2 || noRoot) x = root2;
	if ((M(x) & 1n) === 1n) x = M(-x);
	return {
		isValid: useRoot1 || useRoot2,
		value: x
	};
};
/**
* Hash implementations used by the synchronous API plus the default async WebCrypto provider.
* Both slots are configurable API surface; wrapper helpers revalidate that providers still return
* 64-byte SHA-512 digests.
* @example
* Provide a SHA-512 implementation before calling synchronous helpers.
*
* ```ts
* import * as ed from '@noble/ed25519';
* import { sha512 } from '@noble/hashes/sha2.js';
*
* ed.hashes.sha512 = sha512;
* const { publicKey } = ed.keygen();
* ```
*/
var hashes = {
	sha512Async: async (message) => {
		const s = subtle();
		const m = concatBytes$1(message);
		return u8n(await s.digest("SHA-512", m.buffer));
	},
	sha512: void 0
};
var W = 8;
var pwindows = Math.ceil(256 / W) + 1;
var pwindowSize = 128;
var precompute = () => {
	const points = [];
	let p = G;
	let b = p;
	for (let w = 0; w < pwindows; w++) {
		b = p;
		points.push(b);
		for (let i = 1; i < pwindowSize; i++) {
			b = b.add(p);
			points.push(b);
		}
		p = b.double();
	}
	return points;
};
var Gpows = void 0;
var ctneg = (cnd, p) => {
	const n = p.negate();
	return cnd ? n : p;
};
/**
* Precomputes give 12x faster getPublicKey(), 10x sign(), 2x verify() by
* caching multiples of G (base point). Cache is stored in 32MB of RAM.
* Any time `G.multiply` is done, precomputes are used.
* Not used for getSharedSecret, which instead multiplies random pubkey `P.multiply`.
*
* w-ary non-adjacent form (wNAF) precomputation method is 10% slower than windowed method,
* but takes 2x less RAM. RAM reduction is possible by utilizing `.subtract`.
* Returns the real accumulator `p` plus a fake accumulator `f`; callers only care about `p`, while
* `f` exists to keep similar work in zero-digit branches as a JS/JIT side-channel mitigation.
*
* !! Precomputes can be disabled by commenting-out call of the wNAF() inside Point#multiply().
*/
var wNAF = (n) => {
	const comp = Gpows || (Gpows = precompute());
	let p = I;
	let f = G;
	const maxNum = 2 ** W;
	const mask = big(255);
	const shiftBy = big(W);
	for (let w = 0; w < pwindows; w++) {
		let wbits = Number(n & mask);
		n >>= shiftBy;
		if (wbits > pwindowSize) {
			wbits -= maxNum;
			n += 1n;
		}
		const off = w * pwindowSize;
		const offF = off;
		const offP = off + Math.abs(wbits) - 1;
		const isEven = w % 2 !== 0;
		const isNeg = wbits < 0;
		if (wbits === 0) f = f.add(ctneg(isEven, comp[offF]));
		else p = p.add(ctneg(isNeg, comp[offP]));
	}
	if (n !== 0n) err("invalid wnaf");
	return {
		p,
		f
	};
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/crypto/src/ed25519.mjs
hashes.sha512 = (msg) => sha512(msg);
new Uint8Array([
	21,
	31,
	124,
	117
]);
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/amount.mjs
/** Wrapper class to ensure safe, explicit conversion between µAlgo, Algo and numbers */
var AlgoAmount = class AlgoAmount {
	amountInMicroAlgo;
	/** Return the amount as a number in µAlgo */
	get microAlgos() {
		return this.amountInMicroAlgo;
	}
	/** Return the amount as a number in µAlgo */
	get microAlgo() {
		return this.amountInMicroAlgo;
	}
	/** Return the amount as a number in Algo */
	get algos() {
		return microalgosToAlgos(Number(this.amountInMicroAlgo));
	}
	/** Return the amount as a number in Algo */
	get algo() {
		return microalgosToAlgos(Number(this.amountInMicroAlgo));
	}
	/**
	* Create a new `AlgoAmount` instance.
	*
	* @param amount - An object specifying the amount in Algo or µALGO. Use the key 'algo' for Algo amounts and 'microAlgo' for µALGO.
	* @returns A new instance of `AlgoAmount` representing the specified amount.
	* @example
	* ```typescript
	* const amount = new AlgoAmount({ algo: 5 });
	* ```
	*/
	constructor(amount) {
		this.amountInMicroAlgo = "microAlgos" in amount ? BigInt(amount.microAlgos) : "microAlgo" in amount ? BigInt(amount.microAlgo) : "algos" in amount ? BigInt(algosToMicroalgos(Number(amount.algos))) : BigInt(algosToMicroalgos(Number(amount.algo)));
	}
	toString() {
		return `${this.microAlgo.toLocaleString("en-US")} µALGO`;
	}
	/** valueOf allows you to use `AlgoAmount` in comparison operations such as `<` and `>=` etc.,
	* but it's not recommended to use this to convert to a number, it's much safer to explicitly call
	* the algos or microAlgos properties
	*/
	valueOf() {
		return Number(this.microAlgo);
	}
	/** Create a `AlgoAmount` object representing the given number of Algo */
	static Algos(amount) {
		return new AlgoAmount({ algos: amount });
	}
	/** Create a `AlgoAmount` object representing the given number of Algo */
	static Algo(amount) {
		return new AlgoAmount({ algos: amount });
	}
	/** Create a `AlgoAmount` object representing the given number of µAlgo */
	static MicroAlgos(amount) {
		return new AlgoAmount({ microAlgos: amount });
	}
	/** Create a `AlgoAmount` object representing the given number of µAlgo */
	static MicroAlgo(amount) {
		return new AlgoAmount({ microAlgos: amount });
	}
};
var MICROALGOS_TO_ALGOS_RATIO = 1e6;
var INVALID_MICROALGOS_ERROR_MSG = "Microalgos should be positive and less than 2^53 - 1.";
/**
* microalgosToAlgos converts microalgos to algos
* @param microalgos - number
* @returns number
*/
function microalgosToAlgos(microalgos) {
	if (microalgos < 0 || !Number.isSafeInteger(microalgos)) throw new Error(INVALID_MICROALGOS_ERROR_MSG);
	return microalgos / MICROALGOS_TO_ALGOS_RATIO;
}
/**
* algosToMicroalgos converts algos to microalgos
* @param algos - number
* @returns number
*/
function algosToMicroalgos(algos) {
	const microalgos = algos * MICROALGOS_TO_ALGOS_RATIO;
	return Math.round(microalgos);
}
Number.prototype.microAlgos = function() {
	return AlgoAmount.MicroAlgo(this);
};
Number.prototype.algos = function() {
	return AlgoAmount.Algo(this);
};
Number.prototype.microAlgo = function() {
	return AlgoAmount.MicroAlgo(this);
};
Number.prototype.algo = function() {
	return AlgoAmount.Algo(this);
};
BigInt.prototype.microAlgo = function() {
	return AlgoAmount.MicroAlgo(this);
};
BigInt.prototype.algo = function() {
	return AlgoAmount.Algo(this);
};
AlgoAmount.MicroAlgo(1e3);
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/async-event-emitter.mjs
var AsyncEventEmitter = class {
	listenerWrapperMap = /* @__PURE__ */ new WeakMap();
	listenerMap = {};
	async emitAsync(eventName, event) {
		for (const listener of this.listenerMap[eventName] ?? []) await listener(event, eventName);
	}
	on(eventName, listener) {
		if (!this.listenerMap[eventName]) this.listenerMap[eventName] = [];
		this.listenerMap[eventName].push(listener);
		return this;
	}
	once(eventName, listener) {
		const wrappedListener = async (event, eventName) => {
			try {
				return await listener(event, eventName);
			} finally {
				this.removeListener(eventName, wrappedListener);
			}
		};
		this.listenerWrapperMap.set(listener, wrappedListener);
		return this.on(eventName, wrappedListener);
	}
	removeListener(eventName, listener) {
		const wrappedListener = this.listenerWrapperMap.get(listener);
		if (wrappedListener) {
			this.listenerWrapperMap.delete(listener);
			if (this.listenerMap[eventName]?.indexOf(wrappedListener) !== -1) this.listenerMap[eventName].splice(this.listenerMap[eventName].indexOf(wrappedListener), 1);
		} else if (this.listenerMap[eventName]?.indexOf(listener) !== -1) this.listenerMap[eventName].splice(this.listenerMap[eventName].indexOf(listener), 1);
		return this;
	}
	off = this.removeListener;
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/logging.mjs
/** A logger implementation that writes to console */
var consoleLogger = {
	error: console.error,
	warn: console.warn,
	info: console.info,
	verbose: () => {},
	debug: console.debug
};
/** A logger implementation that does nothing */
var nullLogger = {
	error: function(message, ...optionalParams) {},
	warn: function(message, ...optionalParams) {},
	info: function(message, ...optionalParams) {},
	verbose: function(message, ...optionalParams) {},
	debug: function(message, ...optionalParams) {}
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/updatable-config.mjs
/** Updatable AlgoKit config */
var UpdatableConfig = class {
	config;
	get populateAppCallResources() {
		return this.config.populateAppCallResources;
	}
	get logger() {
		return this.config.logger;
	}
	get debug() {
		return this.config.debug;
	}
	get projectRoot() {
		return this.config.projectRoot;
	}
	get traceAll() {
		return this.config.traceAll;
	}
	get traceBufferSizeMb() {
		return this.config.traceBufferSizeMb;
	}
	get maxSearchDepth() {
		return this.config.maxSearchDepth;
	}
	get events() {
		return this.config.events;
	}
	/**
	* Returns the current logger, or the null logger if true is passed in to `returnNullLogger`
	* @param returnNullLogger Whether or not to return the null logger
	* @returns The requested logger
	*/
	getLogger(returnNullLogger) {
		if (returnNullLogger) return nullLogger;
		return this.logger;
	}
	/**
	* Temporarily run with debug set to true.
	* @param lambda A lambda expression with code to run with debug config set to true
	*/
	withDebug(lambda) {
		const original = this.config.debug;
		try {
			this.config.debug = true;
			lambda();
		} finally {
			this.config.debug = original;
		}
	}
	constructor() {
		this.config = {
			logger: consoleLogger,
			debug: false,
			projectRoot: null,
			traceAll: false,
			traceBufferSizeMb: 256,
			maxSearchDepth: 10,
			populateAppCallResources: true,
			events: new AsyncEventEmitter()
		};
	}
	/**
	* Update the AlgoKit configuration with your own configuration settings
	* @param newConfig Partial or complete config to replace
	*/
	configure(newConfig) {
		this.config = {
			...this.config,
			...newConfig
		};
	}
};
new UpdatableConfig();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/util.mjs
/**
* Memoize calls to the given function in an in-memory map.
* @param fn The function to memoize
* @returns The memoized function
*/
var memoize = (fn) => {
	const cache = /* @__PURE__ */ new Map();
	const cached = function(val) {
		return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val);
	};
	cached.cache = cache;
	return cached;
};
new class CoveredPriority {
	getPriorityType() {
		return 0;
	}
	getDeficitAmount() {
		return 0n;
	}
	compare(other) {
		const typeDiff = this.getPriorityType() - other.getPriorityType();
		if (typeDiff !== 0) return typeDiff;
		return 0;
	}
	equals(other) {
		return other instanceof CoveredPriority;
	}
}();
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/block-rewards.mjs
var BlockRewardsMeta = {
	name: "BlockRewards",
	kind: "object",
	fields: [
		{
			name: "feeSink",
			wireKey: "fee-sink",
			optional: false,
			codec: stringCodec
		},
		{
			name: "rewardsCalculationRound",
			wireKey: "rewards-calculation-round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "rewardsLevel",
			wireKey: "rewards-level",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "rewardsPool",
			wireKey: "rewards-pool",
			optional: false,
			codec: stringCodec
		},
		{
			name: "rewardsRate",
			wireKey: "rewards-rate",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "rewardsResidue",
			wireKey: "rewards-residue",
			optional: false,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/block-upgrade-state.mjs
var BlockUpgradeStateMeta = {
	name: "BlockUpgradeState",
	kind: "object",
	fields: [
		{
			name: "currentProtocol",
			wireKey: "current-protocol",
			optional: false,
			codec: stringCodec
		},
		{
			name: "nextProtocol",
			wireKey: "next-protocol",
			optional: true,
			codec: stringCodec
		},
		{
			name: "nextProtocolApprovals",
			wireKey: "next-protocol-approvals",
			optional: true,
			codec: numberCodec
		},
		{
			name: "nextProtocolSwitchOn",
			wireKey: "next-protocol-switch-on",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "nextProtocolVoteBefore",
			wireKey: "next-protocol-vote-before",
			optional: true,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/block-upgrade-vote.mjs
var BlockUpgradeVoteMeta = {
	name: "BlockUpgradeVote",
	kind: "object",
	fields: [
		{
			name: "upgradeApprove",
			wireKey: "upgrade-approve",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "upgradeDelay",
			wireKey: "upgrade-delay",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "upgradePropose",
			wireKey: "upgrade-propose",
			optional: true,
			codec: stringCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/participation-updates.mjs
var ParticipationUpdatesMeta = {
	name: "ParticipationUpdates",
	kind: "object",
	fields: [{
		name: "expiredParticipationAccounts",
		wireKey: "expired-participation-accounts",
		optional: false,
		codec: stringArrayCodec
	}, {
		name: "absentParticipationAccounts",
		wireKey: "absent-participation-accounts",
		optional: false,
		codec: stringArrayCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/state-proof-tracking.mjs
var StateProofTrackingMeta = {
	name: "StateProofTracking",
	kind: "object",
	fields: [
		{
			name: "type",
			wireKey: "type",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "votersCommitment",
			wireKey: "voters-commitment",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "onlineTotalWeight",
			wireKey: "online-total-weight",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "nextRound",
			wireKey: "next-round",
			optional: true,
			codec: numberCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/state-delta.mjs
var StateDeltaMeta = {
	name: "StateDelta",
	kind: "array",
	codec: new ArrayCodec(new ObjectModelCodec({
		name: "EvalDeltaKeyValue",
		kind: "object",
		fields: [{
			name: "key",
			wireKey: "key",
			optional: false,
			codec: bytesCodec
		}, {
			name: "value",
			wireKey: "value",
			optional: false,
			codec: new ObjectModelCodec({
				name: "EvalDelta",
				kind: "object",
				fields: [
					{
						name: "action",
						wireKey: "action",
						optional: false,
						codec: numberCodec
					},
					{
						name: "bytes",
						wireKey: "bytes",
						optional: true,
						codec: bytesCodec
					},
					{
						name: "uint",
						wireKey: "uint",
						optional: true,
						codec: bigIntCodec
					}
				]
			})
		}]
	}))
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/account-state-delta.mjs
var AccountStateDeltaMeta = {
	name: "AccountStateDelta",
	kind: "object",
	fields: [{
		name: "address",
		wireKey: "address",
		optional: false,
		codec: stringCodec
	}, {
		name: "delta",
		wireKey: "delta",
		optional: false,
		codec: new ArrayModelCodec(StateDeltaMeta)
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/box-reference.mjs
var BoxReferenceMeta = {
	name: "BoxReference",
	kind: "object",
	fields: [{
		name: "app",
		wireKey: "app",
		optional: false,
		codec: bigIntCodec
	}, {
		name: "name",
		wireKey: "name",
		optional: false,
		codec: bytesCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/on-completion.mjs
var OnCompletionMeta = {
	name: "OnCompletion",
	kind: "primitive",
	codec: stringCodec
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/holding-ref.mjs
var HoldingRefMeta = {
	name: "HoldingRef",
	kind: "object",
	fields: [{
		name: "address",
		wireKey: "address",
		optional: false,
		codec: addressCodec
	}, {
		name: "asset",
		wireKey: "asset",
		optional: false,
		codec: bigIntCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/locals-ref.mjs
var LocalsRefMeta = {
	name: "LocalsRef",
	kind: "object",
	fields: [{
		name: "address",
		wireKey: "address",
		optional: false,
		codec: addressCodec
	}, {
		name: "app",
		wireKey: "app",
		optional: false,
		codec: bigIntCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/resource-ref.mjs
var ResourceRefMeta = {
	name: "ResourceRef",
	kind: "object",
	fields: [
		{
			name: "address",
			wireKey: "address",
			optional: true,
			codec: addressCodec
		},
		{
			name: "applicationId",
			wireKey: "application-id",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "assetId",
			wireKey: "asset-id",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "box",
			wireKey: "box",
			optional: true,
			codec: new ObjectModelCodec(BoxReferenceMeta)
		},
		{
			name: "holding",
			wireKey: "holding",
			optional: true,
			codec: new ObjectModelCodec(HoldingRefMeta)
		},
		{
			name: "local",
			wireKey: "local",
			optional: true,
			codec: new ObjectModelCodec(LocalsRefMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/state-schema.mjs
var StateSchemaMeta = {
	name: "StateSchema",
	kind: "object",
	fields: [{
		name: "numUints",
		wireKey: "num-uint",
		optional: false,
		codec: numberCodec
	}, {
		name: "numByteSlices",
		wireKey: "num-byte-slice",
		optional: false,
		codec: numberCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-application.mjs
var TransactionApplicationMeta = {
	name: "TransactionApplication",
	kind: "object",
	fields: [
		{
			name: "applicationId",
			wireKey: "application-id",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "onCompletion",
			wireKey: "on-completion",
			optional: false,
			codec: new PrimitiveModelCodec(OnCompletionMeta)
		},
		{
			name: "applicationArgs",
			wireKey: "application-args",
			optional: true,
			codec: bytesArrayCodec
		},
		{
			name: "access",
			wireKey: "access",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(ResourceRefMeta))
		},
		{
			name: "accounts",
			wireKey: "accounts",
			optional: true,
			codec: addressArrayCodec
		},
		{
			name: "boxReferences",
			wireKey: "box-references",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(BoxReferenceMeta))
		},
		{
			name: "foreignApps",
			wireKey: "foreign-apps",
			optional: true,
			codec: bigIntArrayCodec
		},
		{
			name: "foreignAssets",
			wireKey: "foreign-assets",
			optional: true,
			codec: bigIntArrayCodec
		},
		{
			name: "localStateSchema",
			wireKey: "local-state-schema",
			optional: true,
			codec: new ObjectModelCodec(StateSchemaMeta)
		},
		{
			name: "globalStateSchema",
			wireKey: "global-state-schema",
			optional: true,
			codec: new ObjectModelCodec(StateSchemaMeta)
		},
		{
			name: "approvalProgram",
			wireKey: "approval-program",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "clearStateProgram",
			wireKey: "clear-state-program",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "extraProgramPages",
			wireKey: "extra-program-pages",
			optional: true,
			codec: numberCodec
		},
		{
			name: "rejectVersion",
			wireKey: "reject-version",
			optional: true,
			codec: numberCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/asset-params.mjs
var AssetParamsMeta = {
	name: "AssetParams",
	kind: "object",
	fields: [
		{
			name: "clawback",
			wireKey: "clawback",
			optional: true,
			codec: stringCodec
		},
		{
			name: "creator",
			wireKey: "creator",
			optional: false,
			codec: stringCodec
		},
		{
			name: "decimals",
			wireKey: "decimals",
			optional: false,
			codec: numberCodec
		},
		{
			name: "defaultFrozen",
			wireKey: "default-frozen",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "freeze",
			wireKey: "freeze",
			optional: true,
			codec: stringCodec
		},
		{
			name: "manager",
			wireKey: "manager",
			optional: true,
			codec: stringCodec
		},
		{
			name: "metadataHash",
			wireKey: "metadata-hash",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "name",
			wireKey: "name",
			optional: true,
			codec: stringCodec
		},
		{
			name: "nameB64",
			wireKey: "name-b64",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "reserve",
			wireKey: "reserve",
			optional: true,
			codec: stringCodec
		},
		{
			name: "total",
			wireKey: "total",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "unitName",
			wireKey: "unit-name",
			optional: true,
			codec: stringCodec
		},
		{
			name: "unitNameB64",
			wireKey: "unit-name-b64",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "url",
			wireKey: "url",
			optional: true,
			codec: stringCodec
		},
		{
			name: "urlB64",
			wireKey: "url-b64",
			optional: true,
			codec: bytesCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-asset-config.mjs
var TransactionAssetConfigMeta = {
	name: "TransactionAssetConfig",
	kind: "object",
	fields: [{
		name: "assetId",
		wireKey: "asset-id",
		optional: true,
		codec: bigIntCodec
	}, {
		name: "params",
		wireKey: "params",
		optional: true,
		codec: new ObjectModelCodec(AssetParamsMeta)
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-asset-freeze.mjs
var TransactionAssetFreezeMeta = {
	name: "TransactionAssetFreeze",
	kind: "object",
	fields: [
		{
			name: "address",
			wireKey: "address",
			optional: false,
			codec: stringCodec
		},
		{
			name: "assetId",
			wireKey: "asset-id",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "newFreezeStatus",
			wireKey: "new-freeze-status",
			optional: false,
			codec: booleanCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-asset-transfer.mjs
var TransactionAssetTransferMeta = {
	name: "TransactionAssetTransfer",
	kind: "object",
	fields: [
		{
			name: "amount",
			wireKey: "amount",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "assetId",
			wireKey: "asset-id",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "closeAmount",
			wireKey: "close-amount",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "closeTo",
			wireKey: "close-to",
			optional: true,
			codec: stringCodec
		},
		{
			name: "receiver",
			wireKey: "receiver",
			optional: false,
			codec: stringCodec
		},
		{
			name: "sender",
			wireKey: "sender",
			optional: true,
			codec: stringCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-heartbeat.mjs
var TransactionHeartbeatMeta = {
	name: "TransactionHeartbeat",
	kind: "object",
	fields: [
		{
			name: "hbAddress",
			wireKey: "hb-address",
			optional: false,
			codec: stringCodec
		},
		{
			name: "hbProof",
			wireKey: "hb-proof",
			optional: false,
			codec: new ObjectModelCodec({
				name: "HbProofFields",
				kind: "object",
				fields: [
					{
						name: "hbSig",
						wireKey: "hb-sig",
						optional: true,
						codec: fixedBytes64Codec
					},
					{
						name: "hbPk",
						wireKey: "hb-pk",
						optional: true,
						codec: fixedBytes32Codec
					},
					{
						name: "hbPk2",
						wireKey: "hb-pk2",
						optional: true,
						codec: fixedBytes32Codec
					},
					{
						name: "hbPk1sig",
						wireKey: "hb-pk1sig",
						optional: true,
						codec: fixedBytes64Codec
					},
					{
						name: "hbPk2sig",
						wireKey: "hb-pk2sig",
						optional: true,
						codec: fixedBytes64Codec
					}
				]
			})
		},
		{
			name: "hbSeed",
			wireKey: "hb-seed",
			optional: false,
			codec: bytesCodec
		},
		{
			name: "hbVoteId",
			wireKey: "hb-vote-id",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "hbKeyDilution",
			wireKey: "hb-key-dilution",
			optional: false,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-keyreg.mjs
var TransactionKeyregMeta = {
	name: "TransactionKeyreg",
	kind: "object",
	fields: [
		{
			name: "nonParticipation",
			wireKey: "non-participation",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "selectionParticipationKey",
			wireKey: "selection-participation-key",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "voteFirstValid",
			wireKey: "vote-first-valid",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "voteKeyDilution",
			wireKey: "vote-key-dilution",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "voteLastValid",
			wireKey: "vote-last-valid",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "voteParticipationKey",
			wireKey: "vote-participation-key",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "stateProofKey",
			wireKey: "state-proof-key",
			optional: true,
			codec: fixedBytes64Codec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-payment.mjs
var TransactionPaymentMeta = {
	name: "TransactionPayment",
	kind: "object",
	fields: [
		{
			name: "amount",
			wireKey: "amount",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "closeAmount",
			wireKey: "close-amount",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "closeRemainderTo",
			wireKey: "close-remainder-to",
			optional: true,
			codec: stringCodec
		},
		{
			name: "receiver",
			wireKey: "receiver",
			optional: false,
			codec: stringCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-signature-multisig.mjs
var TransactionSignatureMultisigMeta = {
	name: "TransactionSignatureMultisig",
	kind: "object",
	fields: [
		{
			name: "subsignature",
			wireKey: "subsignature",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec({
				name: "TransactionSignatureMultisigSubsignature",
				kind: "object",
				fields: [{
					name: "publicKey",
					wireKey: "public-key",
					optional: true,
					codec: fixedBytes32Codec
				}, {
					name: "signature",
					wireKey: "signature",
					optional: true,
					codec: fixedBytes64Codec
				}]
			}))
		},
		{
			name: "threshold",
			wireKey: "threshold",
			optional: true,
			codec: numberCodec
		},
		{
			name: "version",
			wireKey: "version",
			optional: true,
			codec: numberCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-signature.mjs
var TransactionSignatureMeta = {
	name: "TransactionSignature",
	kind: "object",
	fields: [
		{
			name: "logicsig",
			wireKey: "logicsig",
			optional: true,
			codec: new ObjectModelCodec({
				name: "TransactionSignatureLogicsig",
				kind: "object",
				fields: [
					{
						name: "args",
						wireKey: "args",
						optional: true,
						codec: bytesArrayCodec
					},
					{
						name: "logic",
						wireKey: "logic",
						optional: false,
						codec: bytesCodec
					},
					{
						name: "multisigSignature",
						wireKey: "multisig-signature",
						optional: true,
						codec: new ObjectModelCodec(TransactionSignatureMultisigMeta)
					},
					{
						name: "logicMultisigSignature",
						wireKey: "logic-multisig-signature",
						optional: true,
						codec: new ObjectModelCodec(TransactionSignatureMultisigMeta)
					},
					{
						name: "signature",
						wireKey: "signature",
						optional: true,
						codec: fixedBytes64Codec
					}
				]
			})
		},
		{
			name: "multisig",
			wireKey: "multisig",
			optional: true,
			codec: new ObjectModelCodec(TransactionSignatureMultisigMeta)
		},
		{
			name: "sig",
			wireKey: "sig",
			optional: true,
			codec: bytesCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/indexer-state-proof-message.mjs
var IndexerStateProofMessageMeta = {
	name: "IndexerStateProofMessage",
	kind: "object",
	fields: [
		{
			name: "blockHeadersCommitment",
			wireKey: "block-headers-commitment",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "votersCommitment",
			wireKey: "voters-commitment",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "lnProvenWeight",
			wireKey: "ln-proven-weight",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "firstAttestedRound",
			wireKey: "first-attested-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "latestAttestedRound",
			wireKey: "latest-attested-round",
			optional: true,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/merkle-array-proof.mjs
var MerkleArrayProofMeta = {
	name: "MerkleArrayProof",
	kind: "object",
	fields: [
		{
			name: "path",
			wireKey: "path",
			optional: true,
			codec: bytesArrayCodec
		},
		{
			name: "hashFactory",
			wireKey: "hash-factory",
			optional: true,
			codec: new ObjectModelCodec({
				name: "HashFactory",
				kind: "object",
				fields: [{
					name: "hashType",
					wireKey: "hash-type",
					optional: true,
					codec: numberCodec
				}]
			})
		},
		{
			name: "treeDepth",
			wireKey: "tree-depth",
			optional: true,
			codec: numberCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/state-proof-participant.mjs
var StateProofParticipantMeta = {
	name: "StateProofParticipant",
	kind: "object",
	fields: [{
		name: "verifier",
		wireKey: "verifier",
		optional: true,
		codec: new ObjectModelCodec({
			name: "StateProofVerifier",
			kind: "object",
			fields: [{
				name: "commitment",
				wireKey: "commitment",
				optional: true,
				codec: fixedBytes64Codec
			}, {
				name: "keyLifetime",
				wireKey: "key-lifetime",
				optional: true,
				codec: bigIntCodec
			}]
		})
	}, {
		name: "weight",
		wireKey: "weight",
		optional: true,
		codec: bigIntCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/state-proof-sig-slot.mjs
var StateProofSigSlotMeta = {
	name: "StateProofSigSlot",
	kind: "object",
	fields: [{
		name: "signature",
		wireKey: "signature",
		optional: true,
		codec: new ObjectModelCodec({
			name: "StateProofSignature",
			kind: "object",
			fields: [
				{
					name: "falconSignature",
					wireKey: "falcon-signature",
					optional: true,
					codec: bytesCodec
				},
				{
					name: "merkleArrayIndex",
					wireKey: "merkle-array-index",
					optional: true,
					codec: numberCodec
				},
				{
					name: "proof",
					wireKey: "proof",
					optional: true,
					codec: new ObjectModelCodec(MerkleArrayProofMeta)
				},
				{
					name: "verifyingKey",
					wireKey: "verifying-key",
					optional: true,
					codec: bytesCodec
				}
			]
		})
	}, {
		name: "lowerSigWeight",
		wireKey: "lower-sig-weight",
		optional: true,
		codec: bigIntCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/state-proof-reveal.mjs
var StateProofRevealMeta = {
	name: "StateProofReveal",
	kind: "object",
	fields: [
		{
			name: "position",
			wireKey: "position",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "sigSlot",
			wireKey: "sig-slot",
			optional: true,
			codec: new ObjectModelCodec(StateProofSigSlotMeta)
		},
		{
			name: "participant",
			wireKey: "participant",
			optional: true,
			codec: new ObjectModelCodec(StateProofParticipantMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/state-proof-fields.mjs
var StateProofFieldsMeta = {
	name: "StateProofFields",
	kind: "object",
	fields: [
		{
			name: "sigCommit",
			wireKey: "sig-commit",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "signedWeight",
			wireKey: "signed-weight",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "sigProofs",
			wireKey: "sig-proofs",
			optional: true,
			codec: new ObjectModelCodec(MerkleArrayProofMeta)
		},
		{
			name: "partProofs",
			wireKey: "part-proofs",
			optional: true,
			codec: new ObjectModelCodec(MerkleArrayProofMeta)
		},
		{
			name: "saltVersion",
			wireKey: "salt-version",
			optional: true,
			codec: numberCodec
		},
		{
			name: "reveals",
			wireKey: "reveals",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(StateProofRevealMeta))
		},
		{
			name: "positionsToReveal",
			wireKey: "positions-to-reveal",
			optional: true,
			codec: bigIntArrayCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction-state-proof.mjs
var TransactionStateProofMeta = {
	name: "TransactionStateProof",
	kind: "object",
	fields: [
		{
			name: "stateProofType",
			wireKey: "state-proof-type",
			optional: true,
			codec: numberCodec
		},
		{
			name: "stateProof",
			wireKey: "state-proof",
			optional: true,
			codec: new ObjectModelCodec(StateProofFieldsMeta)
		},
		{
			name: "message",
			wireKey: "message",
			optional: true,
			codec: new ObjectModelCodec(IndexerStateProofMessageMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/transaction.mjs
var TransactionMeta = {
	name: "Transaction",
	kind: "object",
	fields: [
		{
			name: "applicationTransaction",
			wireKey: "application-transaction",
			optional: true,
			codec: new ObjectModelCodec(TransactionApplicationMeta)
		},
		{
			name: "assetConfigTransaction",
			wireKey: "asset-config-transaction",
			optional: true,
			codec: new ObjectModelCodec(TransactionAssetConfigMeta)
		},
		{
			name: "assetFreezeTransaction",
			wireKey: "asset-freeze-transaction",
			optional: true,
			codec: new ObjectModelCodec(TransactionAssetFreezeMeta)
		},
		{
			name: "assetTransferTransaction",
			wireKey: "asset-transfer-transaction",
			optional: true,
			codec: new ObjectModelCodec(TransactionAssetTransferMeta)
		},
		{
			name: "stateProofTransaction",
			wireKey: "state-proof-transaction",
			optional: true,
			codec: new ObjectModelCodec(TransactionStateProofMeta)
		},
		{
			name: "heartbeatTransaction",
			wireKey: "heartbeat-transaction",
			optional: true,
			codec: new ObjectModelCodec(TransactionHeartbeatMeta)
		},
		{
			name: "authAddr",
			wireKey: "auth-addr",
			optional: true,
			codec: addressCodec
		},
		{
			name: "closeRewards",
			wireKey: "close-rewards",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "closingAmount",
			wireKey: "closing-amount",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "confirmedRound",
			wireKey: "confirmed-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "createdAppId",
			wireKey: "created-application-index",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "createdAssetId",
			wireKey: "created-asset-index",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "fee",
			wireKey: "fee",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "firstValid",
			wireKey: "first-valid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "genesisHash",
			wireKey: "genesis-hash",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "genesisId",
			wireKey: "genesis-id",
			optional: true,
			codec: stringCodec
		},
		{
			name: "group",
			wireKey: "group",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "id",
			wireKey: "id",
			optional: true,
			codec: stringCodec
		},
		{
			name: "intraRoundOffset",
			wireKey: "intra-round-offset",
			optional: true,
			codec: numberCodec
		},
		{
			name: "keyregTransaction",
			wireKey: "keyreg-transaction",
			optional: true,
			codec: new ObjectModelCodec(TransactionKeyregMeta)
		},
		{
			name: "lastValid",
			wireKey: "last-valid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "lease",
			wireKey: "lease",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "note",
			wireKey: "note",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "paymentTransaction",
			wireKey: "payment-transaction",
			optional: true,
			codec: new ObjectModelCodec(TransactionPaymentMeta)
		},
		{
			name: "receiverRewards",
			wireKey: "receiver-rewards",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "rekeyTo",
			wireKey: "rekey-to",
			optional: true,
			codec: addressCodec
		},
		{
			name: "roundTime",
			wireKey: "round-time",
			optional: true,
			codec: numberCodec
		},
		{
			name: "sender",
			wireKey: "sender",
			optional: false,
			codec: stringCodec
		},
		{
			name: "senderRewards",
			wireKey: "sender-rewards",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "signature",
			wireKey: "signature",
			optional: true,
			codec: new ObjectModelCodec(TransactionSignatureMeta)
		},
		{
			name: "txType",
			wireKey: "tx-type",
			optional: false,
			codec: stringCodec
		},
		{
			name: "localStateDelta",
			wireKey: "local-state-delta",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(AccountStateDeltaMeta))
		},
		{
			name: "globalStateDelta",
			wireKey: "global-state-delta",
			optional: true,
			codec: new ArrayModelCodec(StateDeltaMeta)
		},
		{
			name: "logs",
			wireKey: "logs",
			optional: true,
			codec: bytesArrayCodec
		},
		{
			name: "innerTxns",
			wireKey: "inner-txns",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(() => TransactionMeta))
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/block.mjs
var BlockMeta = {
	name: "Block",
	kind: "object",
	fields: [
		{
			name: "proposer",
			wireKey: "proposer",
			optional: true,
			codec: addressCodec
		},
		{
			name: "feesCollected",
			wireKey: "fees-collected",
			optional: true,
			codec: numberCodec
		},
		{
			name: "bonus",
			wireKey: "bonus",
			optional: true,
			codec: numberCodec
		},
		{
			name: "proposerPayout",
			wireKey: "proposer-payout",
			optional: true,
			codec: numberCodec
		},
		{
			name: "genesisHash",
			wireKey: "genesis-hash",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "genesisId",
			wireKey: "genesis-id",
			optional: false,
			codec: stringCodec
		},
		{
			name: "previousBlockHash",
			wireKey: "previous-block-hash",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "previousBlockHash512",
			wireKey: "previous-block-hash-512",
			optional: true,
			codec: fixedBytes64Codec
		},
		{
			name: "rewards",
			wireKey: "rewards",
			optional: false,
			codec: new ObjectModelCodec(BlockRewardsMeta)
		},
		{
			name: "round",
			wireKey: "round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "seed",
			wireKey: "seed",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "stateProofTracking",
			wireKey: "state-proof-tracking",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(StateProofTrackingMeta))
		},
		{
			name: "timestamp",
			wireKey: "timestamp",
			optional: false,
			codec: numberCodec
		},
		{
			name: "transactions",
			wireKey: "transactions",
			optional: false,
			codec: new ArrayCodec(new ObjectModelCodec(TransactionMeta))
		},
		{
			name: "transactionsRoot",
			wireKey: "transactions-root",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "transactionsRootSha256",
			wireKey: "transactions-root-sha256",
			optional: true,
			codec: fixedBytes32Codec
		},
		{
			name: "transactionsRootSha512",
			wireKey: "transactions-root-sha512",
			optional: true,
			codec: fixedBytes64Codec
		},
		{
			name: "txnCounter",
			wireKey: "txn-counter",
			optional: true,
			codec: numberCodec
		},
		{
			name: "upgradeState",
			wireKey: "upgrade-state",
			optional: false,
			codec: new ObjectModelCodec(BlockUpgradeStateMeta)
		},
		{
			name: "upgradeVote",
			wireKey: "upgrade-vote",
			optional: true,
			codec: new ObjectModelCodec(BlockUpgradeVoteMeta)
		},
		{
			name: "participationUpdates",
			wireKey: "participation-updates",
			optional: false,
			codec: new ObjectModelCodec(ParticipationUpdatesMeta)
		}
	]
};
new RecordCodec(unknownCodec);
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/account-participation.mjs
var AccountParticipationMeta = {
	name: "AccountParticipation",
	kind: "object",
	fields: [
		{
			name: "selectionParticipationKey",
			wireKey: "selection-participation-key",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "voteFirstValid",
			wireKey: "vote-first-valid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "voteKeyDilution",
			wireKey: "vote-key-dilution",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "voteLastValid",
			wireKey: "vote-last-valid",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "voteParticipationKey",
			wireKey: "vote-participation-key",
			optional: false,
			codec: fixedBytes32Codec
		},
		{
			name: "stateProofKey",
			wireKey: "state-proof-key",
			optional: true,
			codec: fixedBytes64Codec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/application-state-schema.mjs
var ApplicationStateSchemaMeta = {
	name: "ApplicationStateSchema",
	kind: "object",
	fields: [{
		name: "numUints",
		wireKey: "num-uint",
		optional: false,
		codec: numberCodec
	}, {
		name: "numByteSlices",
		wireKey: "num-byte-slice",
		optional: false,
		codec: numberCodec
	}]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/teal-key-value-store.mjs
var TealKeyValueStoreMeta = {
	name: "TealKeyValueStore",
	kind: "array",
	codec: new ArrayCodec(new ObjectModelCodec({
		name: "TealKeyValue",
		kind: "object",
		fields: [{
			name: "key",
			wireKey: "key",
			optional: false,
			codec: bytesCodec
		}, {
			name: "value",
			wireKey: "value",
			optional: false,
			codec: new ObjectModelCodec({
				name: "TealValue",
				kind: "object",
				fields: [
					{
						name: "type",
						wireKey: "type",
						optional: false,
						codec: numberCodec
					},
					{
						name: "bytes",
						wireKey: "bytes",
						optional: false,
						codec: bytesCodec
					},
					{
						name: "uint",
						wireKey: "uint",
						optional: false,
						codec: bigIntCodec
					}
				]
			})
		}]
	}))
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/application-params.mjs
var ApplicationParamsMeta = {
	name: "ApplicationParams",
	kind: "object",
	fields: [
		{
			name: "creator",
			wireKey: "creator",
			optional: true,
			codec: addressCodec
		},
		{
			name: "approvalProgram",
			wireKey: "approval-program",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "clearStateProgram",
			wireKey: "clear-state-program",
			optional: true,
			codec: bytesCodec
		},
		{
			name: "extraProgramPages",
			wireKey: "extra-program-pages",
			optional: true,
			codec: numberCodec
		},
		{
			name: "localStateSchema",
			wireKey: "local-state-schema",
			optional: true,
			codec: new ObjectModelCodec(ApplicationStateSchemaMeta)
		},
		{
			name: "globalStateSchema",
			wireKey: "global-state-schema",
			optional: true,
			codec: new ObjectModelCodec(ApplicationStateSchemaMeta)
		},
		{
			name: "globalState",
			wireKey: "global-state",
			optional: true,
			codec: new ArrayModelCodec(TealKeyValueStoreMeta)
		},
		{
			name: "version",
			wireKey: "version",
			optional: true,
			codec: numberCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/application.mjs
var ApplicationMeta = {
	name: "Application",
	kind: "object",
	fields: [
		{
			name: "id",
			wireKey: "id",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "deleted",
			wireKey: "deleted",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "createdAtRound",
			wireKey: "created-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "deletedAtRound",
			wireKey: "deleted-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "params",
			wireKey: "params",
			optional: false,
			codec: new ObjectModelCodec(ApplicationParamsMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/application-local-state.mjs
var ApplicationLocalStateMeta = {
	name: "ApplicationLocalState",
	kind: "object",
	fields: [
		{
			name: "id",
			wireKey: "id",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "deleted",
			wireKey: "deleted",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "optedInAtRound",
			wireKey: "opted-in-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "closedOutAtRound",
			wireKey: "closed-out-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "schema",
			wireKey: "schema",
			optional: false,
			codec: new ObjectModelCodec(ApplicationStateSchemaMeta)
		},
		{
			name: "keyValue",
			wireKey: "key-value",
			optional: true,
			codec: new ArrayModelCodec(TealKeyValueStoreMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/asset.mjs
var AssetMeta = {
	name: "Asset",
	kind: "object",
	fields: [
		{
			name: "id",
			wireKey: "index",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "deleted",
			wireKey: "deleted",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "createdAtRound",
			wireKey: "created-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "destroyedAtRound",
			wireKey: "destroyed-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "params",
			wireKey: "params",
			optional: false,
			codec: new ObjectModelCodec(AssetParamsMeta)
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/asset-holding.mjs
var AssetHoldingMeta = {
	name: "AssetHolding",
	kind: "object",
	fields: [
		{
			name: "amount",
			wireKey: "amount",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "assetId",
			wireKey: "asset-id",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "isFrozen",
			wireKey: "is-frozen",
			optional: false,
			codec: booleanCodec
		},
		{
			name: "deleted",
			wireKey: "deleted",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "optedInAtRound",
			wireKey: "opted-in-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "optedOutAtRound",
			wireKey: "opted-out-at-round",
			optional: true,
			codec: bigIntCodec
		}
	]
};
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/indexer_client/src/models/account.mjs
var AccountMeta = {
	name: "Account",
	kind: "object",
	fields: [
		{
			name: "address",
			wireKey: "address",
			optional: false,
			codec: stringCodec
		},
		{
			name: "amount",
			wireKey: "amount",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "minBalance",
			wireKey: "min-balance",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "amountWithoutPendingRewards",
			wireKey: "amount-without-pending-rewards",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "appsLocalState",
			wireKey: "apps-local-state",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(ApplicationLocalStateMeta))
		},
		{
			name: "appsTotalSchema",
			wireKey: "apps-total-schema",
			optional: true,
			codec: new ObjectModelCodec(ApplicationStateSchemaMeta)
		},
		{
			name: "appsTotalExtraPages",
			wireKey: "apps-total-extra-pages",
			optional: true,
			codec: numberCodec
		},
		{
			name: "assets",
			wireKey: "assets",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(AssetHoldingMeta))
		},
		{
			name: "createdApps",
			wireKey: "created-apps",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(ApplicationMeta))
		},
		{
			name: "createdAssets",
			wireKey: "created-assets",
			optional: true,
			codec: new ArrayCodec(new ObjectModelCodec(AssetMeta))
		},
		{
			name: "participation",
			wireKey: "participation",
			optional: true,
			codec: new ObjectModelCodec(AccountParticipationMeta)
		},
		{
			name: "incentiveEligible",
			wireKey: "incentive-eligible",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "pendingRewards",
			wireKey: "pending-rewards",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "rewardBase",
			wireKey: "reward-base",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "rewards",
			wireKey: "rewards",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "round",
			wireKey: "round",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "status",
			wireKey: "status",
			optional: false,
			codec: stringCodec
		},
		{
			name: "sigType",
			wireKey: "sig-type",
			optional: true,
			codec: stringCodec
		},
		{
			name: "totalAppsOptedIn",
			wireKey: "total-apps-opted-in",
			optional: false,
			codec: numberCodec
		},
		{
			name: "totalAssetsOptedIn",
			wireKey: "total-assets-opted-in",
			optional: false,
			codec: numberCodec
		},
		{
			name: "totalBoxBytes",
			wireKey: "total-box-bytes",
			optional: false,
			codec: numberCodec
		},
		{
			name: "totalBoxes",
			wireKey: "total-boxes",
			optional: false,
			codec: numberCodec
		},
		{
			name: "totalCreatedApps",
			wireKey: "total-created-apps",
			optional: false,
			codec: numberCodec
		},
		{
			name: "totalCreatedAssets",
			wireKey: "total-created-assets",
			optional: false,
			codec: numberCodec
		},
		{
			name: "authAddr",
			wireKey: "auth-addr",
			optional: true,
			codec: addressCodec
		},
		{
			name: "lastProposed",
			wireKey: "last-proposed",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "lastHeartbeat",
			wireKey: "last-heartbeat",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "deleted",
			wireKey: "deleted",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "createdAtRound",
			wireKey: "created-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "closedAtRound",
			wireKey: "closed-at-round",
			optional: true,
			codec: bigIntCodec
		}
	]
};
new ObjectModelCodec(AccountMeta);
new ArrayCodec(new ObjectModelCodec(AssetHoldingMeta));
new ArrayCodec(new ObjectModelCodec(AccountMeta));
new ArrayCodec(new ObjectModelCodec({
	name: "MiniAssetHolding",
	kind: "object",
	fields: [
		{
			name: "address",
			wireKey: "address",
			optional: false,
			codec: stringCodec
		},
		{
			name: "amount",
			wireKey: "amount",
			optional: false,
			codec: bigIntCodec
		},
		{
			name: "isFrozen",
			wireKey: "is-frozen",
			optional: false,
			codec: booleanCodec
		},
		{
			name: "deleted",
			wireKey: "deleted",
			optional: true,
			codec: booleanCodec
		},
		{
			name: "optedInAtRound",
			wireKey: "opted-in-at-round",
			optional: true,
			codec: bigIntCodec
		},
		{
			name: "optedOutAtRound",
			wireKey: "opted-out-at-round",
			optional: true,
			codec: bigIntCodec
		}
	]
}));
new ObjectModelCodec(ApplicationMeta);
new ArrayCodec(new ObjectModelCodec(ApplicationMeta));
new ArrayCodec(new ObjectModelCodec({
	name: "ApplicationLogData",
	kind: "object",
	fields: [{
		name: "txId",
		wireKey: "txid",
		optional: false,
		codec: stringCodec
	}, {
		name: "logs",
		wireKey: "logs",
		optional: false,
		codec: bytesArrayCodec
	}]
}));
new ArrayCodec(new ObjectModelCodec(ApplicationLocalStateMeta));
new ObjectModelCodec(AssetMeta);
new ArrayCodec(new ObjectModelCodec({
	name: "BoxDescriptor",
	kind: "object",
	fields: [{
		name: "name",
		wireKey: "name",
		optional: false,
		codec: bytesCodec
	}]
}));
new ArrayCodec(new ObjectModelCodec(AssetMeta));
new ArrayCodec(new ObjectModelCodec(BlockMeta));
new ObjectModelCodec(TransactionMeta);
new ArrayCodec(new ObjectModelCodec(TransactionMeta));
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/kmd_client/src/models/wallet.mjs
var WalletMeta = {
	name: "Wallet",
	kind: "object",
	fields: [
		{
			name: "driverName",
			wireKey: "driver_name",
			optional: false,
			codec: stringCodec
		},
		{
			name: "driverVersion",
			wireKey: "driver_version",
			optional: false,
			codec: numberCodec
		},
		{
			name: "id",
			wireKey: "id",
			optional: false,
			codec: stringCodec
		},
		{
			name: "mnemonicUx",
			wireKey: "mnemonic_ux",
			optional: false,
			codec: booleanCodec
		},
		{
			name: "name",
			wireKey: "name",
			optional: false,
			codec: stringCodec
		},
		{
			name: "supportedTxs",
			wireKey: "supported_txs",
			optional: false,
			codec: new ArrayCodec(new PrimitiveModelCodec({
				name: "TxType",
				kind: "primitive",
				codec: stringCodec
			}))
		}
	]
};
new ArrayCodec(new ObjectModelCodec(WalletMeta));
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/kmd_client/src/models/wallet-handle.mjs
var WalletHandleMeta = {
	name: "WalletHandle",
	kind: "object",
	fields: [{
		name: "expiresSeconds",
		wireKey: "expires_seconds",
		optional: false,
		codec: numberCodec
	}, {
		name: "wallet",
		wireKey: "wallet",
		optional: false,
		codec: new ObjectModelCodec(WalletMeta)
	}]
};
new ObjectModelCodec(WalletHandleMeta);
new ObjectModelCodec(WalletMeta);
new ObjectModelCodec(WalletHandleMeta);
new ObjectModelCodec(WalletMeta);
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/packages/kmd_client/src/models/multisig-sig.mjs
var MultisigSigMeta = {
	name: "MultisigSig",
	kind: "object",
	fields: [
		{
			name: "subsignatures",
			wireKey: "subsig",
			optional: false,
			codec: new ArrayCodec(new ObjectModelCodec({
				name: "MultisigSubsig",
				kind: "object",
				fields: [{
					name: "publicKey",
					wireKey: "pk",
					optional: false,
					codec: bytesCodec
				}, {
					name: "signature",
					wireKey: "s",
					optional: true,
					codec: bytesCodec
				}]
			}))
		},
		{
			name: "threshold",
			wireKey: "thr",
			optional: false,
			codec: numberCodec
		},
		{
			name: "version",
			wireKey: "v",
			optional: false,
			codec: numberCodec
		}
	]
};
new ObjectModelCodec(MultisigSigMeta);
new ObjectModelCodec(MultisigSigMeta);
//#endregion
//#region node_modules/@x402-avm/avm/node_modules/@algorandfoundation/algokit-utils/dispenser-client.mjs
var DispenserAssetName = /* @__PURE__ */ function(DispenserAssetName) {
	DispenserAssetName[DispenserAssetName["Algo"] = 0] = "Algo";
	return DispenserAssetName;
}(DispenserAssetName || {});
DispenserAssetName.Algo;
require_nacl_fast();
memoize(function(account) {
	return account.signer;
});
//#endregion
//#region node_modules/@noble/curves/utils.js
/**
* Hex, bytes and number utilities.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/**
* Validates that a value is an array, optionally validating each element.
* @param item - Value to validate.
* @param title - Label included in thrown errors.
* @param inner - Optional per-element validator, called with the element and its label.
* @returns The validated array.
* @example
* Validate an array of points before batch processing.
*
* ```ts
* aarray([1n, 2n], 'scalars');
* ```
*/
function aarray(item, title, inner = () => {}) {
	if (!Array.isArray(item)) throw new TypeError(`"${title}" expected array, got type=${typeof item}`);
	for (let i = 0; i < item.length; i++) inner(item[i], `${title}[${i}]`);
	return item;
}
/**
* Validates that a value is a byte array.
* @param value - Value to validate.
* @param length - Optional exact byte length.
* @param title - Optional field name.
* @returns Original byte array.
* @example
* Reject non-byte input before passing data into curve code.
*
* ```ts
* abytes(new Uint8Array(1));
* ```
*/
var abytes = (value, length, title) => abytes$2(value, length, title);
/**
* Validates that a value is a non-negative safe integer.
* @param n - Value to validate.
* @param title - Optional field name.
* @returns The validated number.
* @example
* Validate a numeric length before allocating buffers.
*
* ```ts
* anumber(1);
* ```
*/
var anumber = anumber$1;
/**
* Asserts something is a plain object-ish value, not null or array.
* @param value - Value to validate.
* @param title - Label included in thrown errors.
* @returns The validated object.
* @throws On wrong argument types. {@link TypeError}
* @example
* Validate an options object before checking fields.
*
* ```ts
* aobject({ flag: true });
* ```
*/
function aobject(value, title = "object") {
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new TypeError(title === "object" ? "expected valid options object" : `"${title}" expected object, got type=${typeof value}`);
	return value;
}
/**
* Asserts something is a function.
* @param value - Value to validate.
* @param title - Label included in thrown errors.
* @returns The validated function.
* @throws On wrong argument types. {@link TypeError}
* @example
* Validate a required method before calling it.
*
* ```ts
* afunction(() => true, 'predicate');
* ```
*/
function afunction(value, title) {
	if (typeof value !== "function") throw new TypeError(`"${title}" is invalid: expected function, got ${typeof value}`);
	return value;
}
/**
* Encodes bytes as lowercase hex.
* @param bytes - Bytes to encode.
* @returns Lowercase hex string.
* @example
* Serialize bytes as hex for logging or fixtures.
*
* ```ts
* bytesToHex(Uint8Array.of(1, 2, 3));
* ```
*/
var bytesToHex = bytesToHex$3;
/**
* Concatenates byte arrays.
* @param arrays - Byte arrays to join.
* @returns Concatenated bytes.
* @example
* Join domain-separated chunks into one buffer.
*
* ```ts
* concatBytes(Uint8Array.of(1), Uint8Array.of(2));
* ```
*/
var concatBytes = (...arrays) => concatBytes$2(...arrays);
/**
* Decodes lowercase or uppercase hex into bytes.
* @param hex - Hex string to decode.
* @returns Decoded bytes.
* @example
* Parse fixture hex into bytes before hashing.
*
* ```ts
* hexToBytes('0102');
* ```
*/
var hexToBytes = (hex) => hexToBytes$2(hex);
/**
* Checks whether a value is a Uint8Array.
* @param a - Value to inspect.
* @returns `true` when `a` is a Uint8Array.
* @example
* Branch on byte input before decoding it.
*
* ```ts
* isBytes(new Uint8Array(1));
* ```
*/
var isBytes = isBytes$2;
/**
* Reads random bytes from the platform CSPRNG.
* @param bytesLength - Number of random bytes to read.
* @returns Fresh random bytes.
* @example
* Generate a random seed for a keypair.
*
* ```ts
* randomBytes(2);
* ```
*/
var randomBytes = (bytesLength) => randomBytes$1(bytesLength);
var _0n$5 = /* @__PURE__ */ BigInt(0);
var _1n$5 = /* @__PURE__ */ BigInt(1);
var atitle = (title) => title ? `"${title}" ` : "";
/**
* Validates that a flag is boolean.
* @param value - Value to validate.
* @param title - Optional field name.
* @returns Original value.
* @throws On wrong argument types. {@link TypeError}
* @example
* Reject non-boolean option flags early.
*
* ```ts
* abool(true);
* ```
*/
function abool(value, title = "") {
	if (typeof value !== "boolean") throw new TypeError(atitle(title) + "expected boolean, got type=" + typeof value);
	return value;
}
/**
* Validates that a value is a non-negative bigint or safe integer.
* @param n - Value to validate.
* @returns The same validated value.
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate one integer-like value before serializing it.
*
* ```ts
* abignumber(1n);
* ```
*/
function abignumber(n) {
	if (typeof n === "bigint") {
		if (!isPosBig(n)) throw new RangeError("positive bigint expected, got " + n);
	} else anumber(n);
	return n;
}
/**
* Validates that a value is a safe integer.
* @param value - Integer to validate.
* @param title - Optional field name.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate a window size before scalar arithmetic uses it.
*
* ```ts
* asafenumber(1);
* ```
*/
function asafenumber(value, title = "") {
	if (typeof value !== "number") {
		const prefix = title && `"${title}" `;
		throw new TypeError(prefix + "expected number, got type=" + typeof value);
	}
	if (!Number.isSafeInteger(value)) {
		const prefix = title && `"${title}" `;
		throw new RangeError(prefix + "expected safe integer, got " + value);
	}
}
/**
* Parses a big-endian hex string into bigint.
* Accepts odd-length hex through the native `BigInt('0x' + hex)` parser and currently surfaces the
* same native `SyntaxError` for malformed hex instead of wrapping it in a library-specific error.
* @param hex - Hex string without `0x`.
* @returns Parsed bigint value.
* @throws On wrong argument types. {@link TypeError}
* @example
* Parse a scalar from fixture hex.
*
* ```ts
* hexToNumber('ff');
* ```
*/
function hexToNumber(hex) {
	if (typeof hex !== "string") throw new TypeError("hex string expected, got " + typeof hex);
	return hex === "" ? _0n$5 : BigInt("0x" + hex);
}
/**
* Parses big-endian bytes into bigint.
* @param bytes - Bytes in big-endian order.
* @returns Parsed bigint value.
* @throws On wrong argument types. {@link TypeError}
* @example
* Read a scalar encoded in network byte order.
*
* ```ts
* bytesToNumberBE(Uint8Array.of(1, 0));
* ```
*/
function bytesToNumberBE(bytes) {
	return hexToNumber(bytesToHex$3(bytes));
}
/**
* Parses little-endian bytes into bigint.
* @param bytes - Bytes in little-endian order.
* @returns Parsed bigint value.
* @throws On wrong argument types. {@link TypeError}
* @example
* Read a scalar encoded in little-endian form.
*
* ```ts
* bytesToNumberLE(Uint8Array.of(1, 0));
* ```
*/
function bytesToNumberLE(bytes) {
	return hexToNumber(bytesToHex$3(copyBytes(abytes$2(bytes)).reverse()));
}
/**
* Encodes a bigint into fixed-length big-endian bytes.
* @param n - Number to encode.
* @param len - Output length in bytes. Must be greater than zero.
* @returns Big-endian byte array.
* @throws On wrong argument ranges or values. {@link RangeError}
* @throws If a documented runtime validation or state check fails. {@link Error}
* @example
* Serialize a scalar into a 32-byte field element.
*
* ```ts
* numberToBytesBE(255n, 2);
* ```
*/
function numberToBytesBE(n, len) {
	anumber$1(len);
	if (len === 0) throw new Error("zero output length is invalid");
	n = abignumber(n);
	const expectedLen = len * 2;
	const hex = n.toString(16);
	if (hex.length > expectedLen) throw new RangeError("number is too large");
	return hexToBytes$2(hex.padStart(expectedLen, "0"));
}
/**
* Encodes a bigint into fixed-length little-endian bytes.
* @param n - Number to encode.
* @param len - Output length in bytes.
* @returns Little-endian byte array.
* @throws On wrong argument ranges or values. {@link RangeError}
* @throws If a documented runtime validation or state check fails. {@link Error}
* @example
* Serialize a scalar for little-endian protocols.
*
* ```ts
* numberToBytesLE(255n, 2);
* ```
*/
function numberToBytesLE(n, len) {
	return numberToBytesBE(n, len).reverse();
}
/**
* Copies Uint8Array. We can't use u8a.slice(), because u8a can be Buffer,
* and Buffer#slice creates mutable copy. Never use Buffers!
* @param bytes - Bytes to copy.
* @returns Detached copy.
* @example
* Make an isolated copy before mutating serialized bytes.
*
* ```ts
* copyBytes(Uint8Array.of(1, 2, 3));
* ```
*/
function copyBytes(bytes) {
	return Uint8Array.from(abytes(bytes));
}
/**
* Checks whether n is non-negative bigint. Historical name.
* @param n - candidate value
* @returns `true` when the value is bigint and 0 or larger
* @example
* Check a candidate scalar before range validation.
*
* ```ts
* isPosBig(2n);
* ```
*/
function isPosBig(n) {
	return typeof n === "bigint" && _0n$5 <= n;
}
/**
* Checks whether a bigint lies inside a half-open range.
* @param n - Candidate value.
* @param min - Inclusive lower bound.
* @param max - Exclusive upper bound.
* @returns `true` when the value is inside the range.
* @example
* Check whether a candidate scalar fits the field order.
*
* ```ts
* inRange(2n, 1n, 3n);
* ```
*/
function inRange(n, min, max) {
	return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
* Asserts `min <= n < max`. NOTE: upper bound is exclusive.
* @param title - Value label for error messages.
* @param n - Candidate value.
* @param min - Inclusive lower bound.
* @param max - Exclusive upper bound.
* Wrong-type inputs are not separated from out-of-range values here: they still flow through the
* shared `RangeError` path because this is only a throwing wrapper around `inRange(...)`.
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Assert that a bigint stays within one half-open range.
*
* ```ts
* aInRange('x', 2n, 1n, 256n);
* ```
*/
function aInRange(title, n, min, max) {
	if (!inRange(n, min, max)) throw new RangeError("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
/**
* Calculates amount of bits in a bigint.
* Same as `n.toString(2).length`
* TODO: merge with nLength in modular
* @param n - Value to inspect.
* @returns Bit length.
* @throws If the value is negative. {@link Error}
* @example
* Measure the bit length of a scalar before serialization.
*
* ```ts
* bitLen(8n);
* ```
*/
function bitLen(n) {
	if (n < _0n$5) throw new Error("expected non-negative bigint, got " + n);
	return n === _0n$5 ? 0 : n.toString(2).length;
}
/**
* Calculate mask for N bits. Not using ** operator with bigints because of old engines.
* Same as BigInt(`0b${Array(i).fill('1').join('')}`)
* @param n - Number of bits. Negative widths are currently passed through to raw bigint shift
*   semantics and therefore produce `-1n`.
* @returns Bitmask value.
* @example
* Calculate mask for N bits.
*
* ```ts
* bitMask(4);
* ```
*/
var bitMask = (n) => {
	asafenumber(n, "n");
	return (_1n$5 << BigInt(n)) - _1n$5;
};
/**
* Validates declared required and optional field types on a plain object.
* Extra keys are intentionally ignored because many callers validate only the subset they use from
* richer option bags or runtime objects.
* This walks field schemas and formats detailed errors, so avoid it on hot paths; use direct
* one-line guards such as `aobject()`, `afunction()`, `abool()`, or `asafenumber()` instead.
* @param object - Object to validate.
* @param fields - Required field types.
* @param optFields - Optional field types.
* @param title - Object label included in thrown errors.
* @throws On wrong argument types. {@link TypeError}
* @example
* Check user options before building a curve helper.
*
* ```ts
* validateObject({ flag: true }, { flag: 'boolean' });
* ```
*/
function validateObject(object, fields = {}, optFields = {}, title = "object") {
	aobject(object, title);
	aobject(fields, "fields");
	aobject(optFields, "optFields");
	function checkField(fieldName, expectedType, isOpt) {
		const label = title === "object" ? `param "${String(fieldName)}"` : `"${title}.${String(fieldName)}"`;
		const val = object[fieldName];
		if (!Object.hasOwn(object, fieldName) && (isOpt ? val !== void 0 : expectedType !== "function")) throw new TypeError(`${label} is invalid: expected own property`);
		if (isOpt && val === void 0) return;
		const current = typeof val;
		if (current !== expectedType || val === null) throw new TypeError(`${label} is invalid: expected ${expectedType}, got ${current}`);
	}
	const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
	iter(fields, false);
	iter(optFields, true);
}
//#endregion
//#region node_modules/@noble/curves/abstract/modular.js
/**
* Utils for modular division and fields.
* Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
* There is no division: it is replaced by modular multiplicative inverse.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$4 = /* @__PURE__ */ BigInt(0);
var _1n$4 = /* @__PURE__ */ BigInt(1);
var _2n$3 = /* @__PURE__ */ BigInt(2);
var _3n$1 = /* @__PURE__ */ BigInt(3);
var _4n$2 = /* @__PURE__ */ BigInt(4);
var _5n$1 = /* @__PURE__ */ BigInt(5);
var _7n = /* @__PURE__ */ BigInt(7);
var _8n$2 = /* @__PURE__ */ BigInt(8);
var _9n = /* @__PURE__ */ BigInt(9);
var _15n = /* @__PURE__ */ BigInt(15);
var _16n = /* @__PURE__ */ BigInt(16);
var POW_WINDOWED_MIN = /* @__PURE__ */ BigInt("0x10000000000000000");
/**
* @param a - Dividend value.
* @param b - Positive modulus.
* @returns Reduced value in `[0, b)` only when `b` is positive.
* @throws If the modulus is not positive. {@link Error}
* @example
* Normalize a bigint into one field residue.
*
* ```ts
* mod(-1n, 5n);
* ```
*/
function mod(a, b) {
	if (b <= _0n$4) throw new Error("mod: expected positive modulus, got " + b);
	const result = a % b;
	return result >= _0n$4 ? result : b + result;
}
/**
* Efficiently raise num to a power with modular reduction.
* Unsafe in some contexts: uses ladder, so can expose bigint bits.
* Low-level helper: callers that need canonical residues must pass a valid `num` for the chosen
* modulus instead of relying on the `power===0/1` fast paths to normalize it.
* @param num - Base value.
* @param power - Exponent value.
* @param modulo - Reduction modulus.
* @returns Modular exponentiation result.
* @throws If the modulus or exponent is invalid. {@link Error}
* @example
* Raise one bigint to a modular power.
*
* ```ts
* pow(2n, 6n, 11n) // 64n % 11n == 9n
* ```
*/
function pow(num, power, modulo) {
	if (modulo <= _1n$4) throw new Error("pow: expected modulus > 1, got " + modulo);
	if (typeof power !== "bigint") throw new TypeError("invalid exponent: expected bigint, got " + typeof power);
	if (power < _0n$4) throw new Error("invalid exponent, negatives unsupported");
	if (power === _0n$4) return _1n$4;
	if (power === _1n$4) return num;
	let d = num % modulo;
	if (d < _0n$4) d += modulo;
	if (power < POW_WINDOWED_MIN) {
		let p = _1n$4;
		while (power > _0n$4) {
			if (power & _1n$4) p = p * d % modulo;
			d = d * d % modulo;
			power >>= _1n$4;
		}
		return p;
	}
	const digits = [];
	while (power > _0n$4) {
		digits.push(Number(power & _15n));
		power >>= _4n$2;
	}
	const table = new Array(16);
	table[0] = _1n$4;
	table[1] = d;
	for (let i = 2; i < 16; i++) table[i] = table[i - 1] * d % modulo;
	let p = table[digits[digits.length - 1]];
	for (let w = digits.length - 2; w >= 0; w--) {
		p = p * p % modulo;
		p = p * p % modulo;
		p = p * p % modulo;
		p = p * p % modulo;
		const digit = digits[w];
		if (digit !== 0) p = p * table[digit] % modulo;
	}
	return p;
}
/**
* Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)`.
* Low-level helper: callers that need canonical residues must pass a valid `x` for the chosen
* modulus; the `power===0` fast path intentionally returns the input unchanged.
* @param x - Base value.
* @param power - Number of squarings.
* @param modulo - Reduction modulus.
* @returns Repeated-squaring result.
* @throws If the exponent is negative. {@link Error}
* @example
* Apply repeated squaring inside one field.
*
* ```ts
* pow2(3n, 2n, 11n);
* ```
*/
function pow2(x, power, modulo) {
	if (modulo <= _1n$4) throw new Error("pow2: expected modulus > 1, got " + modulo);
	if (power < _0n$4) throw new Error("pow2: expected non-negative exponent, got " + power);
	let res = x;
	while (power-- > _0n$4) {
		res *= res;
		res %= modulo;
	}
	return res;
}
/**
* Inverses number over modulo.
* Implemented using the {@link https://brilliant.org/wiki/extended-euclidean-algorithm/ | extended Euclidean algorithm}.
* @param number - Value to invert.
* @param modulo - Modulus greater than 1.
* @returns Multiplicative inverse.
* @throws If the modulus is invalid or the inverse does not exist. {@link Error}
* @example
* Compute one modular inverse with the extended Euclidean algorithm.
*
* ```ts
* invert(3n, 11n);
* ```
*/
function invert(number, modulo) {
	if (number === _0n$4) throw new Error("invert: expected non-zero number");
	if (modulo <= _1n$4) throw new Error("invert: expected modulus > 1, got " + modulo);
	let a = mod(number, modulo);
	let b = modulo;
	let x = _0n$4, u = _1n$4;
	while (a !== _0n$4) {
		const q = b / a;
		const r = b - a * q;
		const m = x - u * q;
		b = a, a = r, x = u, u = m;
	}
	if (b !== _1n$4) throw new Error("invert: does not exist");
	return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
	const F = Fp;
	if (!F.eql(F.sqr(root), n)) throw new Error("Cannot find square root");
}
function aoddModulus(order, fnName) {
	if ((order & _1n$4) === _0n$4) throw new Error(fnName + ": expected odd modulus, got " + order);
}
function sqrt3mod4(Fp, n) {
	const F = Fp;
	const p1div4 = (F.ORDER + _1n$4) / _4n$2;
	const root = F.pow(n, p1div4);
	assertIsSquare(F, root, n);
	return root;
}
function sqrt5mod8(Fp, n) {
	const F = Fp;
	const p5div8 = (F.ORDER - _5n$1) / _8n$2;
	const n2 = F.mul(n, _2n$3);
	const v = F.pow(n2, p5div8);
	const nv = F.mul(n, v);
	const i = F.mul(F.mul(nv, _2n$3), v);
	const root = F.mul(nv, F.sub(i, F.ONE));
	assertIsSquare(F, root, n);
	return root;
}
function sqrt9mod16(P) {
	const Fp_ = Field(P);
	const tn = tonelliShanks(P);
	const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
	const c2 = tn(Fp_, c1);
	const c3 = tn(Fp_, Fp_.neg(c1));
	const c4 = (P + _7n) / _16n;
	return ((Fp, n) => {
		const F = Fp;
		let tv1 = F.pow(n, c4);
		let tv2 = F.mul(tv1, c1);
		const tv3 = F.mul(tv1, c2);
		const tv4 = F.mul(tv1, c3);
		const e1 = F.eql(F.sqr(tv2), n);
		const e2 = F.eql(F.sqr(tv3), n);
		tv1 = F.cmov(tv1, tv2, e1);
		tv2 = F.cmov(tv4, tv3, e2);
		const e3 = F.eql(F.sqr(tv2), n);
		const root = F.cmov(tv1, tv2, e3);
		assertIsSquare(F, root, n);
		return root;
	});
}
/**
* Tonelli-Shanks square root search algorithm.
* This implementation is variable-time: it searches data-dependently for the first non-residue `Z`
* and for the smallest `i` in the main loop, unlike RFC 9380 Appendix I.4's constant-time shape.
* 1. {@link https://eprint.iacr.org/2012/685.pdf | eprint 2012/685}, page 12
* 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
* @param P - field order
* @returns function that takes field Fp (created from P) and number n
* @throws If the field is too small, non-prime, or the square root does not exist. {@link Error}
* @example
* Construct a square-root helper for primes that need Tonelli-Shanks.
*
* ```ts
* import { Field, tonelliShanks } from '@noble/curves/abstract/modular.js';
* const Fp = Field(17n);
* const sqrt = tonelliShanks(17n)(Fp, 4n);
* ```
*/
function tonelliShanks(P) {
	if (P < _3n$1) throw new Error("sqrt is not defined for small field");
	aoddModulus(P, "tonelliShanks");
	let Q = P - _1n$4;
	let S = 0;
	while (Q % _2n$3 === _0n$4) {
		Q /= _2n$3;
		S++;
	}
	let Z = _2n$3;
	const _Fp = Field(P);
	while (FpLegendre(_Fp, Z) === 1) if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
	if (S === 1) return sqrt3mod4;
	let cc = _Fp.pow(Z, Q);
	const Q1div2 = (Q + _1n$4) / _2n$3;
	return function tonelliSlow(Fp, n) {
		const F = Fp;
		if (F.is0(n)) return n;
		if (FpLegendre(F, n) !== 1) throw new Error("Cannot find square root");
		let M = S;
		let c = F.mul(F.ONE, cc);
		let t = F.pow(n, Q);
		let R = F.pow(n, Q1div2);
		while (!F.eql(t, F.ONE)) {
			if (F.is0(t)) throw new Error("Cannot find square root: probably non-prime P");
			let i = 1;
			let t_tmp = F.sqr(t);
			while (!F.eql(t_tmp, F.ONE)) {
				i++;
				t_tmp = F.sqr(t_tmp);
				if (i === M) throw new Error("Cannot find square root");
			}
			const exponent = _1n$4 << BigInt(M - i - 1);
			const b = F.pow(c, exponent);
			M = i;
			c = F.sqr(b);
			t = F.mul(t, c);
			R = F.mul(R, b);
		}
		return R;
	};
}
/**
* Square root for a finite field. Will try optimized versions first:
*
* 1. P ≡ 3 (mod 4)
* 2. P ≡ 5 (mod 8)
* 3. P ≡ 9 (mod 16)
* 4. Tonelli-Shanks algorithm
*
* Different algorithms can give different roots, it is up to user to decide which one they want.
* For example there is FpSqrtOdd/FpSqrtEven to choose a root by oddness
* (used for hash-to-curve).
* @param P - Field order.
* @returns Square-root helper. The generic fallback inherits Tonelli-Shanks' variable-time
*   behavior and this selector assumes prime-field-style integer moduli.
* @throws If the field is unsupported or the square root does not exist. {@link Error}
* @example
* Choose the square-root helper appropriate for one field modulus.
*
* ```ts
* import { Field, FpSqrt } from '@noble/curves/abstract/modular.js';
* const Fp = Field(17n);
* const sqrt = FpSqrt(17n)(Fp, 4n);
* ```
*/
function FpSqrt(P) {
	aoddModulus(P, "Fp.sqrt");
	if (P % _4n$2 === _3n$1) return sqrt3mod4;
	if (P % _8n$2 === _5n$1) return sqrt5mod8;
	if (P % _16n === _9n) return sqrt9mod16(P);
	return tonelliShanks(P);
}
/**
* @param num - Value to inspect.
* @param modulo - Field modulus.
* @returns `true` when the least-significant little-endian bit is set.
* @throws If the modulus is invalid for `mod(...)`. {@link Error}
* @example
* Inspect the low bit used by little-endian sign conventions.
*
* ```ts
* isNegativeLE(3n, 11n);
* ```
*/
var isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n$4) === _1n$4;
var FIELD_FIELDS = [
	"create",
	"isValid",
	"is0",
	"neg",
	"inv",
	"sqrt",
	"sqr",
	"eql",
	"add",
	"sub",
	"mul",
	"pow",
	"div",
	"addN",
	"subN",
	"mulN",
	"sqrN"
];
/**
* @param field - Field implementation.
* @returns Validated field. This only checks the arithmetic subset needed by generic helpers; it
*   does not guarantee full runtime-method coverage for serialization, batching, `cmov`, or
*   field-specific extras beyond positive `BYTES` / `BITS`.
* @throws If the field shape or numeric metadata are invalid. {@link Error}
* @example
* Check that a field implementation exposes the operations curve code expects.
*
* ```ts
* import { Field, validateField } from '@noble/curves/abstract/modular.js';
* const Fp = validateField(Field(17n));
* ```
*/
function validateField(field) {
	aobject(field, "field");
	if (typeof field.ORDER !== "bigint") throw new TypeError("param \"ORDER\" is invalid: expected bigint, got " + typeof field.ORDER);
	asafenumber(field.BYTES, "BYTES");
	asafenumber(field.BITS, "BITS");
	for (const name of FIELD_FIELDS) afunction(field[name], "field." + name);
	if (field.BYTES < 1 || field.BITS < 1) throw new Error("invalid field: expected BYTES/BITS > 0");
	if (field.ORDER <= _1n$4) throw new Error("invalid field: expected ORDER > 1, got " + field.ORDER);
	return field;
}
function FpInvertBatch(Fp, nums, passZero = false) {
	validateField(Fp);
	aarray(nums, "nums");
	abool(passZero, "passZero");
	const F = Fp;
	const inverted = new Array(nums.length).fill(passZero ? F.ZERO : void 0);
	const multipliedAcc = nums.reduce((acc, num, i) => {
		if (F.is0(num)) return acc;
		inverted[i] = acc;
		return F.mul(acc, num);
	}, F.ONE);
	const invertedAcc = F.inv(multipliedAcc);
	nums.reduceRight((acc, num, i) => {
		if (F.is0(num)) return acc;
		inverted[i] = F.mul(acc, inverted[i]);
		return F.mul(acc, num);
	}, invertedAcc);
	return inverted;
}
/**
* Legendre symbol.
* Legendre constant is used to calculate Legendre symbol (a | p)
* which denotes the value of a^((p-1)/2) (mod p).
*
* * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
* * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
* * (a | p) ≡ 0    if a ≡ 0 (mod p)
* @param Fp - Field implementation.
* @param n - Value to inspect.
* @returns Legendre symbol.
* @throws If the powered value does not match a valid Legendre symbol. {@link Error}
* @example
* Compute the Legendre symbol of one field element.
*
* ```ts
* import { Field, FpLegendre } from '@noble/curves/abstract/modular.js';
* const Fp = Field(17n);
* const symbol = FpLegendre(Fp, 4n);
* ```
*/
function FpLegendre(Fp, n) {
	validateField(Fp);
	const F = Fp;
	aoddModulus(F.ORDER, "FpLegendre");
	const p1mod2 = (F.ORDER - _1n$4) / _2n$3;
	const powered = F.pow(n, p1mod2);
	const yes = F.eql(powered, F.ONE);
	const zero = F.eql(powered, F.ZERO);
	const no = F.eql(powered, F.neg(F.ONE));
	if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
	return yes ? 1 : zero ? 0 : -1;
}
/**
* @param n - Curve order. Callers are expected to pass a positive order.
* @param nBitLength - Optional cached bit length. Callers are expected to pass a positive cached
*   value when overriding the derived bit length.
* @returns Byte and bit lengths.
* @throws If the order or cached bit length is invalid. {@link Error}
* @example
* Measure the encoding sizes needed for one modulus.
*
* ```ts
* nLength(255n);
* ```
*/
function nLength(n, nBitLength) {
	if (nBitLength !== void 0) anumber(nBitLength);
	if (n <= _0n$4) throw new Error("invalid n length: expected positive n, got " + n);
	if (nBitLength !== void 0 && nBitLength < 1) throw new Error("invalid n length: expected positive bit length, got " + nBitLength);
	const bits = bitLen(n);
	if (nBitLength !== void 0 && nBitLength < bits) throw new Error(`invalid n length: expected nBitLength (${nBitLength}) >= bitLen(n) (${bits})`);
	const _nBitLength = nBitLength !== void 0 ? nBitLength : bits;
	return {
		nBitLength: _nBitLength,
		nByteLength: Math.ceil(_nBitLength / 8)
	};
}
var FIELD_SQRT = /* @__PURE__ */ new WeakMap();
var _Field = class {
	ORDER;
	BITS;
	BYTES;
	isLE;
	ZERO = _0n$4;
	ONE = _1n$4;
	_lengths;
	_mod;
	constructor(ORDER, opts = {}) {
		if (ORDER <= _1n$4) throw new Error("invalid field: expected ORDER > 1, got " + ORDER);
		let _nbitLength = void 0;
		this.isLE = false;
		if (opts != null && typeof opts === "object") {
			if (typeof opts.BITS === "number") _nbitLength = opts.BITS;
			if (typeof opts.sqrt === "function") Object.defineProperty(this, "sqrt", {
				value: opts.sqrt,
				enumerable: true
			});
			if (typeof opts.isLE === "boolean") this.isLE = opts.isLE;
			if (opts.allowedLengths) this._lengths = Object.freeze(opts.allowedLengths.slice());
			if (typeof opts.modFromBytes === "boolean") this._mod = opts.modFromBytes;
		}
		const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
		if (nByteLength > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
		this.ORDER = ORDER;
		this.BITS = nBitLength;
		this.BYTES = nByteLength;
		Object.freeze(this);
	}
	create(num) {
		return mod(num, this.ORDER);
	}
	isValid(num) {
		if (typeof num !== "bigint") throw new TypeError("invalid field element: expected bigint, got " + typeof num);
		return _0n$4 <= num && num < this.ORDER;
	}
	is0(num) {
		return num === _0n$4;
	}
	isValidNot0(num) {
		return !this.is0(num) && this.isValid(num);
	}
	isOdd(num) {
		return (num & _1n$4) === _1n$4;
	}
	neg(num) {
		return mod(-num, this.ORDER);
	}
	eql(lhs, rhs) {
		return lhs === rhs;
	}
	sqr(num) {
		return mod(num * num, this.ORDER);
	}
	add(lhs, rhs) {
		return mod(lhs + rhs, this.ORDER);
	}
	sub(lhs, rhs) {
		return mod(lhs - rhs, this.ORDER);
	}
	mul(lhs, rhs) {
		return mod(lhs * rhs, this.ORDER);
	}
	pow(num, power) {
		return pow(num, power, this.ORDER);
	}
	div(lhs, rhs) {
		return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
	}
	sqrN(num) {
		return num * num;
	}
	addN(lhs, rhs) {
		return lhs + rhs;
	}
	subN(lhs, rhs) {
		return lhs - rhs;
	}
	mulN(lhs, rhs) {
		return lhs * rhs;
	}
	inv(num) {
		return invert(num, this.ORDER);
	}
	sqrt(num) {
		let sqrt = FIELD_SQRT.get(this);
		if (!sqrt) FIELD_SQRT.set(this, sqrt = FpSqrt(this.ORDER));
		return sqrt(this, num);
	}
	toBytes(num) {
		return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
	}
	fromBytes(bytes, skipValidation = false) {
		abytes(bytes);
		const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
		if (allowedLengths) {
			if (bytes.length < 1 || !allowedLengths.includes(bytes.length) || bytes.length > BYTES) throw new Error("Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length);
			const padded = new Uint8Array(BYTES);
			padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
			bytes = padded;
		}
		if (bytes.length !== BYTES) throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
		let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
		if (modFromBytes) scalar = mod(scalar, ORDER);
		if (!skipValidation) {
			if (!this.isValid(scalar)) throw new Error("invalid field element: outside of range 0..ORDER");
		}
		return scalar;
	}
	invertBatch(lst) {
		return FpInvertBatch(this, lst, true);
	}
	cmov(a, b, condition) {
		abool(condition, "condition");
		return condition ? b : a;
	}
};
/**
* Creates a finite field. Major performance optimizations:
* * 1. Denormalized operations like mulN instead of mul.
* * 2. Identical object shape: never add or remove keys.
* * 3. Frozen stable object shape; the lazy sqrt cache lives in a module-level `WeakMap`.
* Fragile: always run a benchmark on a change.
* Security note: operations and low-level serializers like `toBytes` don't check `isValid` for
* all elements for performance and protocol-flexibility reasons; callers are responsible for
* supplying valid elements when they need canonical field behavior.
* This is low-level code, please make sure you know what you're doing.
*
* Note about field properties:
* * CHARACTERISTIC p = prime number, number of elements in main subgroup.
* * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
*
* @param ORDER - field order, probably prime, or could be composite
* @param opts - Field options such as bit length or endianness. See {@link FieldOpts}.
* @returns Frozen field instance with a stable object shape. This wrapper forwards `opts` straight
*   into `_Field`, so it inherits `_Field`'s assumptions about cached sizes and `allowedLengths`.
* @example
* Construct one prime field with optional overrides.
*
* ```ts
* Field(11n);
* ```
*/
function Field(ORDER, opts = {}) {
	Object.freeze(_Field.prototype);
	return new _Field(ORDER, opts);
}
//#endregion
//#region node_modules/@noble/curves/abstract/curve.js
/**
* Methods for elliptic curve multiplication by scalars.
* Contains wNAF-based ScalarMultiplier, pippenger.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$3 = /* @__PURE__ */ BigInt(0);
var _1n$3 = /* @__PURE__ */ BigInt(1);
var _4n$1 = /* @__PURE__ */ BigInt(4);
var BLIND_BYTES = 16;
var BLIND_BITS = 128;
var FW_WINDOW = 5;
var TABLE_BYTES_MAX = /* @__PURE__ */ (() => 2 ** 31)();
/**
* Validates the static surface of a point constructor.
* This is only a cheap sanity check for the constructor hooks and fields consumed by generic
* factories; it does not certify `BASE`/`ZERO` semantics or prove the curve implementation itself.
* @param Point - Runtime point constructor.
* @throws On missing constructor hooks or malformed field metadata. {@link TypeError}
* @example
* Check that one point constructor exposes the static hooks generic helpers need.
*
* ```ts
* import { ed25519 } from '@noble/curves/ed25519.js';
* import { validatePointCons } from '@noble/curves/abstract/curve.js';
* validatePointCons(ed25519.Point);
* ```
*/
function validatePointCons(Point) {
	const pc = Point;
	if (typeof pc !== "function") throw new TypeError("\"Point\" expected constructor, got type=" + typeof Point);
	afunction(pc.fromAffine, "Point.fromAffine");
	afunction(pc.fromBytes, "Point.fromBytes");
	afunction(pc.fromHex, "Point.fromHex");
	aobject(pc.BASE, "Point.BASE");
	aobject(pc.ZERO, "Point.ZERO");
	validateField(pc.Fp);
	validateField(pc.Fn);
}
/**
* Takes a bunch of Projective Points but executes only one
* inversion on all of them. Inversion is very slow operation,
* so this improves performance massively.
* Optimization: converts a list of projective points to a list of identical points with Z=1.
* Input points are left unchanged; the normalized points are returned as fresh instances.
* @param c - Point constructor.
* @param points - Projective points.
* @returns Fresh projective points reconstructed from normalized affine coordinates.
* @example
* Batch-normalize projective points with a single shared inversion.
*
* ```ts
* import { normalizeZ } from '@noble/curves/abstract/curve.js';
* import { p256 } from '@noble/curves/nist.js';
* const points = normalizeZ(p256.Point, [p256.Point.BASE, p256.Point.BASE.double()]);
* ```
*/
function normalizeZ(c, points) {
	validatePointCons(c);
	validateMSMPoints(points, c);
	const invertedZs = FpInvertBatch(c.Fp, points.map((p) => p.Z));
	return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits, min = 1) {
	if (!Number.isSafeInteger(W) || W < min || W > bits) throw new Error("invalid window size, expected [" + min + ".." + bits + "], got W=" + W);
}
function validateTableBytes(numPoints, fpBytes) {
	const bytes = numPoints * (4 * fpBytes + 128);
	if (bytes > TABLE_BYTES_MAX) throw new Error("invalid window size: table would need ~" + Math.ceil(bytes / 2 ** 20) + " MiB, max " + TABLE_BYTES_MAX / 2 ** 20 + " MiB");
}
/**
* Probes an RNG once, at construction time: returns `undefined` when it is unavailable —
* throws or returns malformed bytes — so callers can downgrade to their unblinded /
* deterministic constant-time fallback. Blinding is defense-in-depth (DPA/template
* hardening), not a correctness or key-secrecy requirement, so availability-based
* downgrade is acceptable.
*
* The downgrade decision is deliberately static. After a successful probe the RNG becomes
* part of the trusted contract: later misbehavior must fail closed in per-call validation
* (throw), never downgrade — a dynamic fallback would let a tampered RNG silently strip
* blinding on demand. A probe can only ever classify broken environments, not adversarial
* RNGs: a stateful RNG can always behave while probed and misbehave later.
* @param randomBytes - RNG to probe, or `undefined` when the environment provides none.
* @param length - Byte length requested from the probe call.
* @returns The RNG when the probe produced `length` valid bytes; `undefined` otherwise.
* @example
* Probe an RNG once before enabling scalar blinding.
*
* ```ts
* import { probeRandomBytes } from '@noble/curves/abstract/curve.js';
* import { randomBytes } from '@noble/hashes/utils.js';
* const rng = probeRandomBytes(randomBytes, 16);
* ```
*/
function probeRandomBytes(randomBytes, length) {
	if (randomBytes === void 0) return void 0;
	afunction(randomBytes, "randomBytes");
	try {
		const probe = randomBytes(length);
		if (!isBytes(probe) || probe.length !== length) return void 0;
	} catch {
		return;
	}
	return randomBytes;
}
function validateMSMPoints(points, c) {
	aarray(points, "points");
	points.forEach((p, i) => {
		if (!(p instanceof c)) throw new Error("invalid point at index " + i);
	});
}
function validateMSMScalars(scalars, field, maxScalar) {
	if (!Array.isArray(scalars)) throw new Error("array of scalars expected");
	scalars.forEach((s, i) => {
		if (!(maxScalar === void 0 ? field.isValid(s) : isPosBig(s) && s < maxScalar)) throw new Error("invalid scalar at index " + i);
	});
}
var pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getWindowSize(P) {
	return pointWindowSizes.get(P) || 1;
}
/** Table of odd multiples [1P, 3P, ..., (2⋅size−1)P]; width-W wNAF uses size = 2^(W−2). */
function oddMultiples(p, size) {
	const dbl = p.double();
	const t = [p];
	for (let j = 1; j < size; j++) t.push(t[j - 1].add(dbl));
	return t;
}
/**
* Width-W wNAF signed-digit recoding (W >= 2), LSB-first: digits are 0 or odd with
* |digit| < 2^(W−1); nonzero density ~1/(W+1) (a nonzero digit is followed by W−1 zeros).
*/
function wnafDigits(n, W) {
	const size = 2 ** W;
	const half = size / 2;
	const mask = BigInt(size - 1);
	const d = [];
	while (n > _0n$3) {
		let w = 0;
		if (n & _1n$3) {
			w = Number(n & mask);
			if (w >= half) w -= size;
			n -= BigInt(w);
		}
		d.push(w);
		n >>= _1n$3;
	}
	return d;
}
/**
* Fixed-position signed-window recoding for precomputed wNAF: `n = Σ digits[w]⋅2^(w⋅W)` with
* digits in `[−2^(W−1)+1, 2^(W−1)]`. Digit count is fixed by `windows` (callers reserve one
* extra window for the final carry), so recoding length does not depend on the scalar.
*/
function signedWindowDigits(n, W, windows) {
	const size = 2 ** W;
	const half = size / 2;
	const mask = BigInt(size - 1);
	const shiftBy = BigInt(W);
	const d = [];
	for (let w = 0; w < windows; w++) {
		let v = Number(n & mask);
		n >>= shiftBy;
		if (v > half) {
			v -= size;
			n += _1n$3;
		}
		d.push(v);
	}
	if (n !== _0n$3) throw new Error("invalid wnaf");
	return d;
}
/**
* Shared vartime walk over per-scalar wNAF digit streams: one doubling of a single shared
* accumulator per bit position of the longest recoding, one signed table addition per
* nonzero digit. `tables[i]` must hold the odd multiples of the i-th point.
*/
function wnafWalk(zero, tables, digits) {
	let max = 0;
	for (const d of digits) max = Math.max(max, d.length);
	let acc = zero;
	for (let bit = max - 1; bit >= 0; bit--) {
		if (bit !== max - 1) acc = acc.double();
		for (let i = 0; i < digits.length; i++) {
			const w = digits[i][bit];
			if (w) {
				const item = tables[i][Math.abs(w) - 1 >> 1];
				acc = acc.add(w < 0 ? item.negate() : item);
			}
		}
	}
	return acc;
}
/**
* Elliptic curve multiplication of Point by scalar.
* Routes between cached-table, fixed-window, and one-shot wNAF paths; entry points validate
* their own scalars (`mulCT`/`mulCTBlinded`: `1 <= s < Fn.ORDER`; `mulUnsafe`: up to the
* `Fn.ORDER^4` DoS cap via {@link mulAddUnsafe}).
* Table generation is expensive and happens on first call of `multiply()`
* (or eagerly via `precompute(W, false)`). By default, `BASE` point is precomputed.
*
* Cached algorithm is signed fixed-window wNAF:
* - table stores, for every window w, the multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P` — all doublings
*   are baked in, so a multiplication is exactly one table addition per window
* - window count is fixed (`ceil(bits/W) + 1`), so the point-operation count is scalar-independent
*   (basis of the constant-time path)
* - for a 256-bit curve and W=6: 44⋅32 = 1408 table points, 44 additions per multiply
* - secret scalars are additionally blinded (see {@link ScalarMultiplier.mulCTBlinded}), which
*   widens tables by 128 bits
* @param Point - Point constructor.
* @param randomBytes - RNG used for scalar blinding; required by the blinded secret path.
* @example
* Elliptic curve multiplication of Point by scalar.
*
* ```ts
* import { ScalarMultiplier } from '@noble/curves/abstract/curve.js';
* import { p256 } from '@noble/curves/nist.js';
* const mul = new ScalarMultiplier(p256.Point);
* ```
*/
var ScalarMultiplier = class {
	Point;
	BASE;
	ZERO;
	randomBytes;
	wnafPrecomputes = /* @__PURE__ */ new WeakMap();
	baseCanBeBlinded;
	bits;
	constructor(Point, randomBytes) {
		validatePointCons(Point);
		this.randomBytes = probeRandomBytes(randomBytes, BLIND_BYTES);
		this.Point = Point;
		this.BASE = Point.BASE;
		this.ZERO = Point.ZERO;
		this.bits = Point.Fn.BITS;
	}
	/**
	* Creates a signed fixed-window wNAF precomputation table: for every window w, the
	* multiples `[1..2^(W−1)]⋅2^(w⋅W)⋅P`, flattened. All doublings are baked into the table,
	* so cached multiplication is additions-only. `windows = ceil(bits/W) + 1`: the extra
	* window absorbs the final carry of signed-digit recoding.
	* For a 256-bit curve and W=6, the table is 44⋅32 = 1408 points.
	* @param point - Point instance
	* @param W - window size
	* @param bits - scalar bitlength the table must cover
	*/
	buildWnafTable(point, W, bits) {
		const windows = Math.ceil(bits / W) + 1;
		const half = 2 ** (W - 1);
		const comp = [];
		let base = point;
		for (let w = 0; w < windows; w++) {
			let acc = base;
			for (let i = 0; i < half; i++) {
				comp.push(acc);
				acc = acc.add(base);
			}
			base = comp[comp.length - 1].double();
		}
		return {
			W,
			bits,
			windows,
			comp
		};
	}
	/**
	* Implements ec multiplication using precomputed signed fixed-window wNAF tables.
	* Constant-time: fixed window count with one table addition per window — zero digits feed
	* the fake accumulator — and no doublings; the lookup scans the whole window slice.
	* Scalar bounds are validated by the public entry points ({@link ScalarMultiplier.mulCT},
	* {@link ScalarMultiplier.mulCTBlinded}, {@link ScalarMultiplier.mulUnsafe});
	* signedWindowDigits throws if `n` exceeds the table.
	* @returns real and fake (for const-time) points
	*/
	wnafCachedCT(precomputes, n) {
		const { W, windows, comp } = precomputes;
		const half = 2 ** (W - 1);
		const digits = signedWindowDigits(n, W, windows);
		let p = this.ZERO;
		let f = this.BASE;
		for (let w = 0; w < windows; w++) {
			const digit = digits[w];
			const start = w * half;
			const idx = Math.abs(digit) - 1;
			let sel = comp[start];
			for (let i = 1; i < half; i++) sel = i === idx ? comp[start + i] : sel;
			const neg = sel.negate();
			if (digit === 0) f = f.add(comp[start]);
			else p = p.add(digit < 0 ? neg : sel);
		}
		return {
			p,
			f
		};
	}
	getWnafPrecomputes(W, point, bits, transform) {
		let entries = this.wnafPrecomputes.get(point);
		let comp = entries?.find((entry) => entry.W === W && entry.bits === bits);
		if (!comp) {
			comp = this.buildWnafTable(point, W, bits);
			if (typeof transform === "function") comp = {
				...comp,
				comp: transform(comp.comp)
			};
			if (!entries) {
				entries = [];
				this.wnafPrecomputes.set(point, entries);
			}
			entries.push(comp);
		}
		return comp;
	}
	assertPoint(point) {
		if (!(point instanceof this.Point)) throw new TypeError("\"point\" expected Point instance, got type=" + typeof point);
	}
	validateMulInput(point, scalar) {
		this.assertPoint(point);
		if (!inRange(scalar, _1n$3, this.Point.Fn.ORDER)) throw new Error("invalid scalar");
	}
	runCT(point, n, bits, transform) {
		const W = getWindowSize(point);
		if (W === 1) return this.fixedWindowCT(point, n, bits);
		return this.wnafCachedCT(this.getWnafPrecomputes(W, point, bits, transform), n);
	}
	mulCT(point, scalar, transform) {
		this.validateMulInput(point, scalar);
		return this.runCT(point, scalar, this.bits, transform);
	}
	mulCTBlinded(point, scalar, transform) {
		this.validateMulInput(point, scalar);
		if (this.randomBytes === void 0) throw new Error("randomBytes is required for scalar blinding");
		const bits = this.Point.Fn.BITS + BLIND_BITS;
		const blind = this.randomBytes(BLIND_BYTES);
		if (!isBytes(blind) || blind.length !== BLIND_BYTES) throw new Error("randomBytes returned invalid byte array");
		blind[0] = blind[0] & 63 | 128;
		const n = scalar + bytesToNumberBE(blind) * this.Point.Fn.ORDER;
		return this.runCT(point, n, bits, transform);
	}
	/**
	* Constant-time multiplication `n*point` for an un-precomputed point, via a small fixed window.
	* A cached wNAF table only pays off when reused; a flat 2^FW_WINDOW table (`size-1` adds) is
	* far cheaper to build for a single use. The point-operation sequence is independent of `n`:
	* build the table, then per window exactly FW_WINDOW doublings, a data-oblivious scan over
	* every table entry, and one addition (adds the identity when the window digit is 0 — never
	* skipped).
	*
	* `n` must be `< 2^bits`. Assumes complete addition (adding the identity costs the same as any
	* add), which holds for the Weierstrass/Edwards point types used here. The table is left in
	* projective form (no normalizeZ): normalizing this small a table costs more than the
	* mixed-add savings it would buy for a single multiply.
	* @returns real point `p`; `f` duplicates it only to match {@link wnafCachedCT}'s return shape
	* (this path needs no fake accumulator — its op-count is already scalar-independent).
	*/
	fixedWindowCT(point, n, bits) {
		const W = FW_WINDOW;
		const size = 32;
		const mask = bitMask(W);
		const table = new Array(size);
		table[0] = this.ZERO;
		for (let i = 1; i < size; i++) table[i] = table[i - 1].add(point);
		const windows = Math.ceil(bits / W);
		let acc = this.ZERO;
		for (let window = windows - 1; window >= 0; window--) {
			if (window !== windows - 1) for (let d = 0; d < W; d++) acc = acc.double();
			const digit = Number(n >> BigInt(window * W) & mask);
			let sel = table[0];
			for (let i = 1; i < size; i++) sel = i === digit ? table[i] : sel;
			acc = acc.add(sel);
		}
		return {
			p: acc,
			f: acc
		};
	}
	shouldBlind(point, cofactor) {
		if (this.randomBytes === void 0) return false;
		if (cofactor === _1n$3) return true;
		if (point !== this.BASE) return false;
		if (this.baseCanBeBlinded === void 0) this.baseCanBeBlinded = this.mulUnsafe(this.BASE, this.Point.Fn.ORDER).is0();
		return this.baseCanBeBlinded;
	}
	mulSecret(point, scalar, cofactor, transform) {
		return this.shouldBlind(point, cofactor) ? this.mulCTBlinded(point, scalar, transform) : this.mulCT(point, scalar, transform);
	}
	mulUnsafe(point, scalar, transform) {
		this.assertPoint(point);
		if (!isPosBig(scalar)) throw new Error("invalid scalar");
		const W = getWindowSize(point);
		if (W === 1 || scalar >= this.Point.Fn.ORDER) return mulAddUnsafe(this.Point, [point], [scalar], true);
		const precomputes = this.getWnafPrecomputes(W, point, this.bits, transform);
		return this.wnafCachedCT(precomputes, scalar).p;
	}
	setWindowSize(point, W) {
		this.assertPoint(point);
		validateW(W, this.bits);
		validateTableBytes((Math.ceil((this.bits + BLIND_BITS) / W) + 1) * 2 ** (W - 1), this.Point.Fp.BYTES);
		pointWindowSizes.set(point, W);
		this.wnafPrecomputes.delete(point);
	}
	hasWindowSize(point) {
		return getWindowSize(point) !== 1;
	}
};
/**
* Combined multi-scalar multiplication `Σ scalars[i]⋅points[i]` via interleaved width-4 wNAF
* (Strauss–Shamir). Every input gets its own table of odd multiples `[1P, 3P, 5P, 7P]` and
* signed-digit recoding, but all walks share one doubling chain, so total cost is
* `~bits` doublings + `L⋅bits/5` additions instead of `L⋅bits` doublings for separate
* multiplications. Intended for the 2-4 point shapes of signature verification
* (`R = u1⋅G + u2⋅P`); use {@link pippenger} for larger batches.
*
* Not constant-time: only for public inputs. Scalars must satisfy `0 <= s < Fn.ORDER`;
* fold negative signs into the points before calling.
* @param c - Point constructor.
* @param points - Array of curve points.
* @param scalars - Array of non-negative scalars, same length as points.
* @param allowOversized - Replace the `s < Fn.ORDER` scalar check with a `Fn.ORDER^4` DoS cap.
*   Off by default. For scalars that must NOT be reduced mod ORDER: torsion checks
*   (`Fn.ORDER⋅P ≟ O`) and cofactor-clearing multiples. Walk length grows with `bitLen(s)`.
* @returns Combined multiplication result; identity for empty input.
* @throws If the point set or scalar set is invalid. {@link Error}
* @example
* Combined multi-scalar multiplication via Strauss–Shamir.
*
* ```ts
* import { mulAddUnsafe } from '@noble/curves/abstract/curve.js';
* import { p256 } from '@noble/curves/nist.js';
* const G = p256.Point.BASE;
* const R = mulAddUnsafe(p256.Point, [G, G.double()], [2n, 3n]); // 2⋅G + 3⋅(2⋅G)
* ```
*/
function mulAddUnsafe(c, points, scalars, allowOversized = false) {
	validatePointCons(c);
	validateMSMPoints(points, c);
	abool(allowOversized, "allowOversized");
	validateMSMScalars(scalars, c.Fn, allowOversized ? c.Fn.ORDER ** _4n$1 : void 0);
	if (points.length !== scalars.length) throw new Error("arrays of points and scalars must have equal length");
	const tables = points.map((p) => oddMultiples(p, 4));
	const digits = scalars.map((n) => wnafDigits(n, 4));
	return wnafWalk(c.ZERO, tables, digits);
}
function createField(order, field, isLE) {
	if (field) {
		if (field.ORDER !== order) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
		validateField(field);
		return field;
	} else return Field(order, { isLE });
}
/**
* Validates basic CURVE shape and field membership, then creates fields.
* This does not prove that the generator is on-curve, that subgroup/order data are consistent, or
* that the curve equation itself is otherwise sane.
* @param type - Curve family.
* @param CURVE - Curve parameters.
* @param curveOpts - Optional field overrides. See {@link FpFn}:
*   - `Fp` (optional): Optional base-field override.
*   - `Fn` (optional): Optional scalar-field override.
* @param FpFnLE - Whether field encoding is little-endian.
* @returns Frozen curve parameters and fields.
* @throws If the curve parameters or field overrides are invalid. {@link Error}
* @example
* Build curve fields from raw constants before constructing a curve instance.
*
* ```ts
* const curve = createCurveFields('weierstrass', {
*   p: 17n,
*   n: 19n,
*   h: 1n,
*   a: 2n,
*   b: 2n,
*   Gx: 5n,
*   Gy: 1n,
* });
* ```
*/
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
	if (type !== "weierstrass" && type !== "edwards") throw new Error("expected curve type \"weierstrass\" or \"edwards\"");
	if (FpFnLE === void 0) FpFnLE = type === "edwards";
	if (!CURVE || typeof CURVE !== "object") throw new Error(`expected valid ${type} CURVE object`);
	validateObject(curveOpts);
	for (const p of [
		"p",
		"n",
		"h"
	]) {
		const val = CURVE[p];
		if (!(isPosBig(val) && val !== _0n$3)) throw new Error(`CURVE.${p} must be positive bigint`);
	}
	const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
	const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
	const params = [
		"Gx",
		"Gy",
		"a",
		type === "weierstrass" ? "b" : "d"
	];
	for (const p of params) if (!Fp.isValid(CURVE[p])) throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
	CURVE = Object.freeze(Object.assign({}, CURVE));
	return {
		CURVE,
		Fp,
		Fn
	};
}
/**
* @param randomSecretKey - Secret-key generator.
* @param getPublicKey - Public-key derivation helper.
* @returns Keypair generator.
* @example
* Build a `keygen()` helper from existing secret-key and public-key primitives.
*
* ```ts
* import { createKeygen } from '@noble/curves/abstract/curve.js';
* import { p256 } from '@noble/curves/nist.js';
* const keygen = createKeygen(p256.utils.randomSecretKey, p256.getPublicKey);
* const pair = keygen();
* ```
*/
function createKeygen(randomSecretKey, getPublicKey) {
	return function keygen(seed) {
		const secretKey = randomSecretKey(seed);
		return {
			secretKey,
			publicKey: getPublicKey(secretKey)
		};
	};
}
//#endregion
//#region node_modules/@noble/curves/abstract/edwards.js
/**
* Twisted Edwards curve. The formula is: ax² + y² = 1 + dx²y².
* For design rationale of types / exports, see weierstrass module documentation.
* Untwisted Edwards curves exist, but they aren't used in real-world protocols.
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$2 = /* @__PURE__ */ BigInt(0);
var _1n$2 = /* @__PURE__ */ BigInt(1);
var _2n$2 = /* @__PURE__ */ BigInt(2);
var _4n = /* @__PURE__ */ BigInt(4);
var _8n$1 = /* @__PURE__ */ BigInt(8);
function isEdValidXY(Fp, CURVE, x, y) {
	const x2 = Fp.sqr(x);
	const y2 = Fp.sqr(y);
	const left = Fp.add(Fp.mul(CURVE.a, x2), y2);
	const right = Fp.add(Fp.ONE, Fp.mul(CURVE.d, Fp.mul(x2, y2)));
	return Fp.eql(left, right);
}
/**
* @param params - Curve parameters. See {@link EdwardsOpts}.
* @param extraOpts - Optional helpers and overrides. See {@link EdwardsExtraOpts}.
* @returns Edwards point constructor. Generator validation here only checks
*   that `(Gx, Gy)` satisfies the affine Edwards equation.
*   RFC 8032 base-point constraints like `B != (0,1)` and `[L]B = 0`
*   are left to the caller's chosen parameters, since eager subgroup
*   validation here adds about 10-15ms to heavyweight imports like ed448.
*   The returned constructor also eagerly marks `Point.BASE` for W=6
*   precompute caching. Some code paths still assume
*   `Fp.BYTES === Fn.BYTES`, so mismatched byte lengths are not fully audited here.
* @throws If the curve parameters or Edwards overrides are invalid. {@link Error}
* @example
* ```ts
* import { edwards } from '@noble/curves/abstract/edwards.js';
* import { jubjub } from '@noble/curves/misc.js';
* // Build a point constructor from explicit curve parameters, then use its base point.
* const Point = edwards(jubjub.Point.CURVE());
* Point.BASE.toHex();
* ```
*/
function edwards(params, extraOpts = {}) {
	validateObject(extraOpts, {}, {}, "extraOpts");
	const opts = extraOpts;
	const validated = createCurveFields("edwards", params, opts, opts.FpFnLE);
	const { Fp, Fn } = validated;
	let CURVE = validated.CURVE;
	const { h: cofactor } = CURVE;
	if (FpLegendre(Fp, CURVE.a) !== 1) throw new Error("edwards: CURVE.a must be a square in Fp for complete addition formulas");
	if (FpLegendre(Fp, CURVE.d) !== -1) throw new Error("edwards: CURVE.d must be a non-square in Fp for complete addition formulas");
	validateObject(opts, {}, {
		uvRatio: "function",
		randomBytes: "function"
	});
	const randomBytes$2 = opts.randomBytes === void 0 ? randomBytes : opts.randomBytes;
	const MASK = _2n$2 << BigInt(Fp.BYTES * 8) - _1n$2;
	function isOdd(n) {
		if (!Fp.isOdd) throw new Error("Field does not have .isOdd()");
		return Fp.isOdd(n);
	}
	const uvRatio = opts.uvRatio === void 0 ? (u, v) => {
		try {
			return {
				isValid: true,
				value: Fp.sqrt(Fp.div(u, v))
			};
		} catch (e) {
			return {
				isValid: false,
				value: _0n$2
			};
		}
	} : opts.uvRatio;
	if (!isEdValidXY(Fp, CURVE, CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
	const mulA = Fp.eql(CURVE.a, Fp.neg(Fp.ONE)) ? (x) => Fp.neg(x) : Fp.eql(CURVE.a, Fp.ONE) ? (x) => x : (x) => Fp.mul(CURVE.a, x);
	/**
	* Asserts coordinate is valid: 0 <= n < MASK.
	* Coordinates >= Fp.ORDER are allowed for zip215.
	*/
	function acoord(title, n, banZero = false) {
		const min = banZero ? _1n$2 : _0n$2;
		aInRange("coordinate " + title, n, min, MASK);
		return n;
	}
	function aedpoint(other) {
		if (!(other instanceof Point)) throw new Error("EdwardsPoint expected");
	}
	class Point {
		static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE, Fp.mul(CURVE.Gx, CURVE.Gy));
		static ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ONE, Fp.ZERO);
		static Fp = Fp;
		static Fn = Fn;
		X;
		Y;
		Z;
		T;
		constructor(X, Y, Z, T) {
			this.X = acoord("x", X);
			this.Y = acoord("y", Y);
			this.Z = acoord("z", Z, true);
			this.T = acoord("t", T);
			Object.freeze(this);
		}
		static CURVE() {
			return CURVE;
		}
		/**
		* Create one extended Edwards point from affine coordinates.
		* Does NOT validate that the point is on-curve or torsion-free.
		* Use `.assertValidity()` on adversarial inputs.
		*/
		static fromAffine(p) {
			if (p instanceof Point) throw new Error("extended point not allowed");
			const { x, y } = p || {};
			acoord("x", x);
			acoord("y", y);
			return new Point(x, y, Fp.ONE, Fp.mul(x, y));
		}
		static fromBytes(bytes, zip215 = false) {
			const len = Fp.BYTES;
			const { a, d } = CURVE;
			bytes = copyBytes(abytes(bytes, len, "point"));
			abool(zip215, "zip215");
			const normed = copyBytes(bytes);
			const lastByte = bytes[len - 1];
			normed[len - 1] = lastByte & -129;
			const y = bytesToNumberLE(normed);
			aInRange("point.y", y, _0n$2, zip215 ? MASK : Fp.ORDER);
			const y2 = Fp.sqr(y);
			const u = Fp.sub(y2, Fp.ONE);
			const v = Fp.sub(Fp.mulN(d, y2), a);
			let { isValid, value: x } = uvRatio(u, v);
			if (!isValid) throw new Error("bad point: invalid y coordinate");
			const isXOdd = isOdd(x);
			const isLastByteOdd = (lastByte & 128) !== 0;
			if (!zip215 && Fp.is0(x) && isLastByteOdd) throw new Error("bad point: x=0 and x_0=1");
			if (isLastByteOdd !== isXOdd) x = Fp.neg(x);
			return Point.fromAffine({
				x,
				y
			});
		}
		static fromHex(hex, zip215 = false) {
			return Point.fromBytes(hexToBytes(hex), zip215);
		}
		get x() {
			return this.toAffine().x;
		}
		get y() {
			return this.toAffine().y;
		}
		precompute(windowSize = 6, isLazy = true) {
			wnaf.setWindowSize(this, windowSize);
			if (!isLazy) this.multiply(_2n$2);
			return this;
		}
		assertValidity() {
			const p = this;
			const { a, d } = CURVE;
			if (p.is0()) throw new Error("bad point: ZERO");
			const { X, Y, Z, T } = p;
			const X2 = Fp.sqr(X);
			const Y2 = Fp.sqr(Y);
			const Z2 = Fp.sqr(Z);
			const Z4 = Fp.sqr(Z2);
			const aX2 = Fp.mul(X2, a);
			const left = Fp.mul(Fp.add(aX2, Y2), Z2);
			const right = Fp.add(Z4, Fp.mul(d, Fp.mul(X2, Y2)));
			if (!Fp.eql(left, right)) throw new Error("bad point: equation left != right (1)");
			const XY = Fp.mul(X, Y);
			const ZT = Fp.mul(Z, T);
			if (!Fp.eql(XY, ZT)) throw new Error("bad point: equation left != right (2)");
		}
		equals(other) {
			aedpoint(other);
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const { X: X2, Y: Y2, Z: Z2 } = other;
			const X1Z2 = Fp.mul(X1, Z2);
			const X2Z1 = Fp.mul(X2, Z1);
			const Y1Z2 = Fp.mul(Y1, Z2);
			const Y2Z1 = Fp.mul(Y2, Z1);
			return Fp.eql(X1Z2, X2Z1) && Fp.eql(Y1Z2, Y2Z1);
		}
		is0() {
			return this.equals(Point.ZERO);
		}
		negate() {
			return new Point(Fp.neg(this.X), this.Y, this.Z, Fp.neg(this.T));
		}
		double() {
			const { X: X1, Y: Y1, Z: Z1 } = this;
			const A = Fp.sqr(X1);
			const B = Fp.sqr(Y1);
			const C = Fp.mul(Fp.sqr(Z1), _2n$2);
			const D = mulA(A);
			const x1y1 = Fp.addN(X1, Y1);
			const E = Fp.sub(Fp.subN(Fp.sqr(x1y1), A), B);
			const G = Fp.addN(D, B);
			const F = Fp.subN(G, C);
			const H = Fp.subN(D, B);
			const X3 = Fp.mul(E, F);
			const Y3 = Fp.mul(G, H);
			const T3 = Fp.mul(E, H);
			const Z3 = Fp.mul(F, G);
			return new Point(X3, Y3, Z3, T3);
		}
		add(other) {
			aedpoint(other);
			const { d } = CURVE;
			const { X: X1, Y: Y1, Z: Z1, T: T1 } = this;
			const { X: X2, Y: Y2, Z: Z2, T: T2 } = other;
			const A = Fp.mul(X1, X2);
			const B = Fp.mul(Y1, Y2);
			const C = Fp.mul(Fp.mulN(T1, d), T2);
			const D = Fp.mul(Z1, Z2);
			const E = Fp.sub(Fp.subN(Fp.mulN(Fp.addN(X1, Y1), Fp.addN(X2, Y2)), A), B);
			const F = Fp.subN(D, C);
			const G = Fp.addN(D, C);
			const H = Fp.sub(B, mulA(A));
			const X3 = Fp.mul(E, F);
			const Y3 = Fp.mul(G, H);
			const T3 = Fp.mul(E, H);
			const Z3 = Fp.mul(F, G);
			return new Point(X3, Y3, Z3, T3);
		}
		subtract(other) {
			aedpoint(other);
			return this.add(other.negate());
		}
		multiply(scalar) {
			if (!Fn.isValidNot0(scalar)) throw new RangeError("invalid scalar: expected 1 <= sc < curve.n");
			const { p, f } = wnaf.mulSecret(this, scalar, cofactor, normalize);
			return normalize([p, f])[0];
		}
		multiplyUnsafe(scalar) {
			if (!Fn.isValid(scalar)) throw new RangeError("invalid scalar: expected 0 <= sc < curve.n");
			if (scalar === _0n$2) return Point.ZERO;
			if (this.is0() || scalar === _1n$2) return this;
			return wnaf.mulUnsafe(this, scalar, normalize);
		}
		isSmallOrder() {
			return this.clearCofactor().is0();
		}
		isTorsionFree() {
			return wnaf.mulUnsafe(this, CURVE.n).is0();
		}
		toAffine(invertedZ) {
			const p = this;
			let iz = invertedZ;
			if (iz != null && typeof iz !== "bigint") throw new TypeError("\"invertedZ\" expected bigint, got type=" + typeof iz);
			const { X, Y, Z } = p;
			const is0 = p.is0();
			if (iz == null) iz = is0 ? Fp.create(_8n$1) : Fp.inv(Z);
			const x = Fp.mul(X, iz);
			const y = Fp.mul(Y, iz);
			const zz = Fp.mul(Z, iz);
			if (is0) return {
				x: Fp.ZERO,
				y: Fp.ONE
			};
			if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
			return {
				x,
				y
			};
		}
		clearCofactor() {
			if (cofactor === _1n$2) return this;
			if (cofactor === _2n$2) return this.double();
			if (cofactor === _4n) return this.double().double();
			if (cofactor === _8n$1) return this.double().double().double();
			return this.multiplyUnsafe(cofactor);
		}
		toBytes() {
			const { x, y } = this.toAffine();
			const bytes = Fp.toBytes(y);
			bytes[bytes.length - 1] |= isOdd(x) ? 128 : 0;
			return bytes;
		}
		toHex() {
			return bytesToHex(this.toBytes());
		}
		toString() {
			return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
		}
	}
	const normalize = (points) => normalizeZ(Point, points);
	const wnaf = new ScalarMultiplier(Point, randomBytes$2);
	if (wnaf.bits >= 6) Point.BASE.precompute(6);
	Object.freeze(Point.prototype);
	Object.freeze(Point);
	return Point;
}
/**
* Initializes EdDSA signatures over given Edwards curve.
* @param Point - Edwards point constructor.
* @param cHash - Hash function.
* @param eddsaOpts - Optional signature helpers. See {@link EdDSAOpts}.
* @returns EdDSA helper namespace.
* @throws If the hash function, options, or derived point operations are invalid. {@link Error}
* @example
* Initializes EdDSA signatures over given Edwards curve.
*
* ```ts
* import { eddsa } from '@noble/curves/abstract/edwards.js';
* import { jubjub } from '@noble/curves/misc.js';
* import { sha512 } from '@noble/hashes/sha2.js';
* const sigs = eddsa(jubjub.Point, sha512);
* const { secretKey, publicKey } = sigs.keygen();
* const msg = new TextEncoder().encode('hello noble');
* const sig = sigs.sign(msg, secretKey);
* const isValid = sigs.verify(sig, msg, publicKey);
* ```
*/
function eddsa(Point, cHash, eddsaOpts = {}) {
	validatePointCons(Point);
	if (typeof cHash !== "function") throw new Error("\"hash\" function param is required");
	const hash = cHash;
	const opts = eddsaOpts;
	validateObject(opts, {}, {
		adjustScalarBytes: "function",
		randomBytes: "function",
		domain: "function",
		prehash: "function",
		zip215: "boolean",
		mapToCurve: "function",
		toMontgomery: "function",
		toMontgomerySecret: "function"
	});
	const { prehash } = opts;
	const { BASE, Fp, Fn } = Point;
	const outputLen = hash.outputLen;
	const expectedLen = 2 * Fp.BYTES;
	if (outputLen !== void 0) {
		asafenumber(outputLen, "hash.outputLen");
		if (outputLen !== expectedLen) throw new Error(`hash.outputLen must be ${expectedLen}, got ${outputLen}`);
	}
	const randomBytes$3 = opts.randomBytes === void 0 ? randomBytes : opts.randomBytes;
	const toMontgomery = opts.toMontgomery;
	const toMontgomerySecret = opts.toMontgomerySecret;
	const adjustScalarBytes = opts.adjustScalarBytes === void 0 ? (bytes) => bytes : opts.adjustScalarBytes;
	const domain = opts.domain === void 0 ? (data, ctx, phflag) => {
		abool(phflag, "phflag");
		if (ctx.length || phflag) throw new Error("Contexts/pre-hash are not supported");
		return data;
	} : opts.domain;
	function modN_LE(hash) {
		return Fn.create(bytesToNumberLE(hash));
	}
	function getPrivateScalar(key) {
		const len = lengths.secretKey;
		abytes(key, lengths.secretKey, "secretKey");
		const hashed = abytes(hash(key), 2 * len, "hashedSecretKey");
		const head = adjustScalarBytes(hashed.slice(0, len));
		return {
			head,
			prefix: hashed.slice(len, 2 * len),
			scalar: modN_LE(head)
		};
	}
	/** Convenience method that creates public key from scalar. RFC8032 5.1.5
	* Also exposes the derived scalar/prefix tuple and point form reused by sign().
	*/
	function getExtendedPublicKey(secretKey) {
		const { head, prefix, scalar } = getPrivateScalar(secretKey);
		const point = BASE.multiply(scalar);
		return {
			head,
			prefix,
			scalar,
			point,
			pointBytes: point.toBytes()
		};
	}
	/** Calculates EdDSA pub key. RFC8032 5.1.5. */
	function getPublicKey(secretKey) {
		return getExtendedPublicKey(secretKey).pointBytes;
	}
	function hashDomainToScalar(context = Uint8Array.of(), ...msgs) {
		const msg = concatBytes(...msgs);
		return modN_LE(hash(domain(msg, abytes(context, void 0, "context"), !!prehash)));
	}
	/** Signs message with secret key. RFC8032 5.1.6 */
	function sign(msg, secretKey, options = {}) {
		validateObject(options, {}, {}, "options");
		msg = abytes(msg, void 0, "message");
		if (prehash) msg = prehash(msg);
		const { prefix, scalar, pointBytes } = getExtendedPublicKey(secretKey);
		const r = hashDomainToScalar(options.context, prefix, msg);
		const R = BASE.multiply(r).toBytes();
		const k = hashDomainToScalar(options.context, R, pointBytes, msg);
		const s = Fn.create(r + k * scalar);
		if (!Fn.isValid(s)) throw new Error("sign failed: invalid s");
		return abytes(concatBytes(R, Fn.toBytes(s)), lengths.signature, "result");
	}
	const verifyOpts = { zip215: opts.zip215 };
	/**
	* Verifies EdDSA signature against message and public key. RFC 8032 §§5.1.7 and 5.2.7.
	* A cofactored verification equation is checked.
	*/
	function verify(sig, msg, publicKey, options = verifyOpts) {
		validateObject(options);
		const { context } = options;
		const zip215 = options.zip215 === void 0 ? !!verifyOpts.zip215 : options.zip215;
		const len = lengths.signature;
		sig = abytes(sig, len, "signature");
		msg = abytes(msg, void 0, "message");
		publicKey = abytes(publicKey, lengths.publicKey, "publicKey");
		if (zip215 !== void 0) abool(zip215, "zip215");
		if (prehash) msg = prehash(msg);
		const mid = len / 2;
		const r = sig.subarray(0, mid);
		const s = bytesToNumberLE(sig.subarray(mid, len));
		let A, R, SB;
		try {
			A = Point.fromBytes(publicKey, zip215);
			R = Point.fromBytes(r, zip215);
			SB = BASE.multiplyUnsafe(s);
		} catch (error) {
			return false;
		}
		if (!zip215 && A.isSmallOrder()) return false;
		const k = hashDomainToScalar(context, r, publicKey, msg);
		return R.add(A.multiplyUnsafe(k)).subtract(SB).clearCofactor().is0();
	}
	const _size = Fp.BYTES;
	const lengths = {
		secretKey: _size,
		publicKey: _size,
		signature: 2 * _size,
		seed: _size
	};
	function randomSecretKey(seed) {
		seed = seed === void 0 ? randomBytes$3(lengths.seed) : seed;
		return abytes(seed, lengths.seed, "seed");
	}
	function isValidSecretKey(key) {
		return isBytes(key) && key.length === lengths.secretKey;
	}
	function isValidPublicKey(key, zip215) {
		try {
			return !!Point.fromBytes(key, zip215 === void 0 ? verifyOpts.zip215 : zip215);
		} catch (error) {
			return false;
		}
	}
	const utils = {
		getExtendedPublicKey,
		randomSecretKey,
		isValidSecretKey,
		isValidPublicKey,
		/** Converts an Edwards public key to a companion Montgomery public key. */
		toMontgomery(publicKey) {
			if (toMontgomery === void 0) throw new Error("Montgomery conversion is not supported for this curve");
			return toMontgomery(Point.fromBytes(publicKey));
		},
		toMontgomerySecret(secretKey) {
			if (toMontgomerySecret === void 0) throw new Error("Montgomery conversion is not supported for this curve");
			return toMontgomerySecret(secretKey);
		}
	};
	Object.freeze(lengths);
	Object.freeze(utils);
	return Object.freeze({
		keygen: createKeygen(randomSecretKey, getPublicKey),
		getPublicKey,
		sign,
		verify,
		utils,
		Point,
		lengths
	});
}
//#endregion
//#region node_modules/@noble/curves/abstract/montgomery.js
/**
* Montgomery curve methods. It's not really whole montgomery curve,
* just bunch of very specific methods for X25519 / X448 from
* [RFC 7748](https://www.rfc-editor.org/rfc/rfc7748)
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n$1 = /* @__PURE__ */ BigInt(0);
var _1n$1 = /* @__PURE__ */ BigInt(1);
var _2n$1 = /* @__PURE__ */ BigInt(2);
/**
* Selector for cswap(): `P` to keep, `P + 1` to swap, chosen by the low bit of `swap`.
* Higher bits are ignored, and `swap` is passed in whole rather than as a {0n, 1n} bit on
* purpose: `P + (swap & _1n)` would short-circuit the addition whenever the bit is clear, which
* is the very leak this construction avoids, one round-trip further down. Subtracting `swap`
* with its low bit cleared keeps every operand full-width instead.
* @param P - Field modulus.
* @param swap - Value whose low bit selects; ignored above that bit.
* @returns `P` when the low bit is clear, `P + 1` when it is set.
*/
function cmask(P, swap) {
	return P + swap - (swap >> _1n$1 << _1n$1);
}
/**
* Swap two field elements when `mask` is `P + 1`, keep them when it is `P`:
*
*   d    = 6P + x_3 - x_2
*   x_2' = d * mask + x_2   (mod P)      x_3' = (x_2 + x_3) - x_2'
*
* The extra `6P * mask` vanishes modulo P, so `mask === P` leaves x_2 and `mask === P + 1`
* leaves x_3. Without the offset, the reduction dividend changes sign with input order and crosses
* BigInt limb boundaries; those classes measured differently on the tested Node/V8 build. For
* canonical inputs, the deliberately left-associative `offset + x_3 - x_2` is between 5P and 7P,
* keeping the dividend positive and in one word-count band for both RFC fields and masks. Six is
* the smallest coefficient `c` for which the shared offset `cP` has that property.
*
* This reduced the tested sign/size timing ratios, but JavaScript BigInt has no constant-time
* contract and the contents of the multiply and remainder still vary. Valid ladder states can
* contain genuine zero coordinates; this construction does not mask those value-shape effects.
* Computing `x_3'` independently as `((6P + x_2 - x_3) * mask + x_3) % P` is more symmetric.
* On the tested Node/V8 build, it reduced the timing difference between keeping `(0, v)` and
* swapping `(v, 0)`—both return `(0, v)`—from about 10%/13% for X25519/X448 to about 3%.
* Successful calls cannot reach that zero-in-the-first-output case. For the case they can reach,
* swapping `(0, v)` and keeping `(v, 0)` both return `(v, 0)`; the difference instead grew from
* about 0.7%/1.1% to 2.7%/2.8%. The extra multiply/remainder also made public
* `getSharedSecret()` about 16% slower. The retained one-remainder form measured about 2.5%
* slower than the prior helper for public X25519 `getSharedSecret()` in the same environment.
* x_3' falls out of the sum, which a swap leaves invariant: no second multiply or reduction is
* needed. Bind `6P` once per field so production and the timing regression exercise the same
* configured helper without paying for the multiplication in every ladder round.
*
* The returned function is called twice per ladder round, so it validates nothing. Both elements
* MUST already be reduced mod P; unreduced input silently corrupts the kept-side output.
* @param P - Field modulus.
* @returns A field-bound swap function taking mask, x_2, and x_3.
*/
function cswap(P) {
	const offset = BigInt(6) * P;
	return (mask, x_2, x_3) => {
		const sum = x_2 + x_3;
		const a = ((offset + x_3 - x_2) * mask + x_2) % P;
		return {
			x_2: a,
			x_3: sum - a
		};
	};
}
function validateOpts(curve) {
	validateObject(curve, {
		P: "bigint",
		type: "string",
		adjustScalarBytes: "function",
		powPminus2: "function"
	}, {
		randomBytes: "function",
		scalarMultBase: "function"
	});
	return Object.freeze({ ...curve });
}
/**
* @param curveDef - Montgomery curve definition.
* @returns ECDH helper namespace.
* @throws If the curve definition or derived shared point is invalid. {@link Error}
* @example
* Build an X25519 helper from curve parameters, then derive one public key.
*
* ```ts
* import { montgomery } from '@noble/curves/abstract/montgomery.js';
* const P = 2n ** 255n - 19n;
* const mod = (num: bigint) => {
*   const out = num % P;
*   return out >= 0n ? out : out + P;
* };
* const pow = (num: bigint, power: bigint) => {
*   let res = 1n;
*   for (; power > 0n; power >>= 1n) {
*     if (power & 1n) res = mod(res * num);
*     num = mod(num * num);
*   }
*   return res;
* };
* const x25519 = montgomery({
*   P,
*   type: 'x25519',
*   adjustScalarBytes(bytes: Uint8Array) {
*     bytes[0] &= 248;
*     bytes[31] &= 127;
*     bytes[31] |= 64;
*     return bytes;
*   },
*   powPminus2(x) {
*     return pow(x, P - 2n);
*   },
* });
* const publicKey = x25519.getPublicKey(new Uint8Array(32).fill(1));
* ```
*/
function montgomery(curveDef) {
	const CURVE = validateOpts(curveDef);
	const { P, type, adjustScalarBytes, powPminus2, randomBytes: rand } = CURVE;
	const mulBaseHook = CURVE.scalarMultBase;
	const is25519 = type === "x25519";
	if (!is25519 && type !== "x448") throw new Error("invalid type");
	const randomBytes_ = rand === void 0 ? randomBytes : rand;
	const montgomeryBits = is25519 ? 255 : 448;
	const swap = cswap(P);
	const fieldLen = is25519 ? 32 : 56;
	const Gu = is25519 ? BigInt(9) : BigInt(5);
	const a24 = is25519 ? BigInt(121665) : BigInt(39081);
	const minScalar = is25519 ? _2n$1 ** BigInt(254) : _2n$1 ** BigInt(447);
	const maxScalar = minScalar + (is25519 ? BigInt(8) * (_2n$1 ** BigInt(251) - _1n$1) : BigInt(4) * (_2n$1 ** BigInt(445) - _1n$1)) + _1n$1;
	const modP = (n) => mod(n, P);
	const GuBytes = encodeU(Gu);
	function encodeU(u) {
		return numberToBytesLE(modP(u), fieldLen);
	}
	function decodeU(u) {
		const _u = copyBytes(abytes(u, fieldLen, "uCoordinate"));
		if (is25519) _u[31] &= 127;
		return modP(bytesToNumberLE(_u));
	}
	function decodeScalar(scalar) {
		return bytesToNumberLE(adjustScalarBytes(copyBytes(abytes(scalar, fieldLen, "scalar"))));
	}
	/**
	* u coordinates whose order divides the cofactor, on the curve and on its quadratic twist -
	* the ladder sends every one of them to zero. Same blocklist libsodium and post-CVE-2017-0379
	* Libgcrypt carry. decodeU() reduces mod P first, so the non-canonical encodings P and P + 1
	* collapse onto 0 and 1, and `type` admits no curve beyond these two, so both lists are total.
	*
	* Complete by construction: x-only doubling sends u to (u^2 - 1)^2 / 4u(u^2 + a*u + 1). Order 4
	* therefore needs (u^2 - 1)^2 === 0, i.e. u = +-1; order 2 needs u(u^2 + a*u + 1) === 0, and
	* a^2 - 4 is a non-residue on both curves, leaving u = 0. curve448 stops there (cofactor 4);
	* curve25519 (cofactor 8) adds the two order-8 roots below. Cross-checked by clearing the
	* cofactor with those same doublings over 200k random u: no sixth value exists.
	*/
	const lowOrderU = new Set(is25519 ? [
		_0n$1,
		_1n$1,
		P - _1n$1,
		BigInt("325606250916557431795983626356110631294008115727848805560023387167927233504"),
		BigInt("39382357235489614581723060781553021112529911719440698176882885853963445705823")
	] : [
		_0n$1,
		_1n$1,
		P - _1n$1
	]);
	function scalarMult(scalar, u) {
		const pointU = decodeU(u);
		if (lowOrderU.has(pointU)) throw new Error("invalid private or public key received");
		const pu = montgomeryLadder(pointU, decodeScalar(scalar));
		if (pu === _0n$1) throw new Error("invalid private or public key received");
		return encodeU(pu);
	}
	function scalarMultBase(scalar) {
		if (mulBaseHook === void 0) return scalarMult(scalar, GuBytes);
		const k = decodeScalar(scalar);
		aInRange("scalar", k, minScalar, maxScalar);
		const pu = modP(mulBaseHook(k));
		if (pu === _0n$1) throw new Error("invalid private or public key received");
		return encodeU(pu);
	}
	const getPublicKey = scalarMultBase;
	const getSharedSecret = scalarMult;
	/**
	* Montgomery x-only multiplication ladder for the selected X25519/X448 curve.
	* @param pointU - decoded Montgomery u coordinate for the selected curve
	* @param scalar - decoded clamped scalar by which the point is multiplied
	* @returns resulting Montgomery u coordinate for the selected curve
	*/
	function montgomeryLadder(u, scalar) {
		aInRange("u", u, _0n$1, P);
		aInRange("scalar", scalar, minScalar, maxScalar);
		const k = scalar;
		const x_1 = u;
		let x_2 = _1n$1;
		let z_2 = _0n$1;
		let x_3 = u;
		let z_3 = _1n$1;
		const kx = k ^ k >> _1n$1;
		for (let t = BigInt(montgomeryBits - 1); t >= _0n$1; t--) {
			const mask = cmask(P, kx >> t);
			({x_2, x_3} = swap(mask, x_2, x_3));
			({x_2: z_2, x_3: z_3} = swap(mask, z_2, z_3));
			const A = x_2 + z_2;
			const AA = modP(A * A);
			const B = x_2 - z_2;
			const BB = modP(B * B);
			const E = AA - BB;
			const C = x_3 + z_3;
			const D = x_3 - z_3;
			const DA = modP(D * A);
			const CB = modP(C * B);
			const dacb = DA + CB;
			const da_cb = DA - CB;
			x_3 = modP(dacb * dacb);
			z_3 = modP(x_1 * modP(da_cb * da_cb));
			x_2 = modP(AA * BB);
			z_2 = modP(E * (AA + modP(a24 * E)));
		}
		const mask = cmask(P, k);
		({x_2, x_3} = swap(mask, x_2, x_3));
		({x_2: z_2, x_3: z_3} = swap(mask, z_2, z_3));
		const z2 = powPminus2(z_2);
		return modP(x_2 * z2);
	}
	const lengths = {
		secretKey: fieldLen,
		publicKey: fieldLen,
		seed: fieldLen
	};
	const randomSecretKey = (seed) => {
		seed = seed === void 0 ? randomBytes_(fieldLen) : seed;
		abytes(seed, lengths.seed, "seed");
		return seed;
	};
	const utils = { randomSecretKey };
	Object.freeze(lengths);
	Object.freeze(utils);
	return Object.freeze({
		keygen: createKeygen(randomSecretKey, getPublicKey),
		getSharedSecret,
		getPublicKey,
		scalarMult,
		scalarMultBase,
		utils,
		GuBytes: GuBytes.slice(),
		lengths
	});
}
//#endregion
//#region node_modules/@noble/curves/ed25519.js
/**
* ed25519 Twisted Edwards curve with following addons:
* - X25519 ECDH
* - Ristretto cofactor elimination
* - Elligator hash-to-group / point indistinguishability
* @module
*/
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
var _0n = /* @__PURE__ */ BigInt(0);
var _1n = /* @__PURE__ */ BigInt(1);
var _2n = /* @__PURE__ */ BigInt(2);
var _3n = /* @__PURE__ */ BigInt(3);
var _5n = /* @__PURE__ */ BigInt(5);
var _8n = /* @__PURE__ */ BigInt(8);
var ed25519_CURVE_p = /* @__PURE__ */ BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed");
var ed25519_CURVE = /* @__PURE__ */ (() => ({
	p: ed25519_CURVE_p,
	n: BigInt("0x1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed"),
	h: _8n,
	a: BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffec"),
	d: BigInt("0x52036cee2b6ffe738cc740797779e89800700a4d4141d8ab75eb4dca135978a3"),
	Gx: BigInt("0x216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a"),
	Gy: BigInt("0x6666666666666666666666666666666666666666666666666666666666666658")
}))();
function ed25519_pow_2_252_3(x) {
	const _10n = BigInt(10), _20n = BigInt(20), _40n = BigInt(40), _80n = BigInt(80);
	const P = ed25519_CURVE_p;
	const b2 = x * x % P * x % P;
	const b5 = pow2(pow2(b2, _2n, P) * b2 % P, _1n, P) * x % P;
	const b10 = pow2(b5, _5n, P) * b5 % P;
	const b20 = pow2(b10, _10n, P) * b10 % P;
	const b40 = pow2(b20, _20n, P) * b20 % P;
	const b80 = pow2(b40, _40n, P) * b40 % P;
	return {
		pow_p_5_8: pow2(pow2(pow2(pow2(b80, _80n, P) * b80 % P, _80n, P) * b80 % P, _10n, P) * b10 % P, _2n, P) * x % P,
		b2
	};
}
function adjustScalarBytes(bytes) {
	bytes[0] &= 248;
	bytes[31] &= 127;
	bytes[31] |= 64;
	return bytes;
}
var ED25519_SQRT_M1 = /* @__PURE__ */ BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752");
function uvRatio(u, v) {
	const P = ed25519_CURVE_p;
	const v3 = mod(v * v * v, P);
	const pow = ed25519_pow_2_252_3(u * mod(v3 * v3 * v, P)).pow_p_5_8;
	let x = mod(u * v3 * pow, P);
	const vx2 = mod(v * x * x, P);
	const root1 = x;
	const root2 = mod(x * ED25519_SQRT_M1, P);
	const useRoot1 = vx2 === u;
	const useRoot2 = vx2 === mod(-u, P);
	const noRoot = vx2 === mod(-u * ED25519_SQRT_M1, P);
	if (useRoot1) x = root1;
	if (useRoot2 || noRoot) x = root2;
	if (isNegativeLE(x, P)) x = mod(-x, P);
	return {
		isValid: useRoot1 || useRoot2,
		value: x
	};
}
var ed25519_Point = /* @__PURE__ */ edwards(ed25519_CURVE, { uvRatio });
var Fp = /* @__PURE__ */ (() => ed25519_Point.Fp)();
function toMontgomery(point) {
	const { y } = point;
	return Fp.toBytes(Fp.div(_1n + y, _1n - y));
}
function toMontgomerySecret(secretKey) {
	const size = ed25519_Point.Fp.BYTES;
	abytes$2(secretKey, size);
	return adjustScalarBytes(sha512(secretKey.subarray(0, size))).subarray(0, size);
}
function ed(opts) {
	return eddsa(ed25519_Point, sha512, Object.assign({
		adjustScalarBytes,
		toMontgomery,
		toMontgomerySecret,
		zip215: true
	}, opts));
}
/**
* ed25519 curve with EdDSA signatures.
* Seeded `keygen(seed)` / `utils.randomSecretKey(seed)` reuse the provided
* 32-byte seed buffer instead of copying it.
* @example
* Generate one Ed25519 keypair, sign a message, and verify it.
*
* ```js
* import { ed25519 } from '@noble/curves/ed25519.js';
* const { secretKey, publicKey } = ed25519.keygen();
* // const publicKey = ed25519.getPublicKey(secretKey);
* const msg = new TextEncoder().encode('hello noble');
* const sig = ed25519.sign(msg, secretKey);
* const isValid = ed25519.verify(sig, msg, publicKey); // ZIP215
* // RFC8032 / FIPS 186-5
* const isValid2 = ed25519.verify(sig, msg, publicKey, { zip215: false });
* ```
*/
var ed25519 = /* @__PURE__ */ ed({});
/**
* ECDH using curve25519 aka x25519.
* `getSharedSecret()` rejects low-order peer inputs by default, and seeded
* `keygen(seed)` reuses the provided 32-byte seed buffer instead of copying it.
* @example
* Derive one shared secret between two X25519 peers.
*
* ```js
* import { x25519 } from '@noble/curves/ed25519.js';
* const alice = x25519.keygen();
* const bob = x25519.keygen();
* const alicePublic = x25519.getPublicKey(alice.secretKey);
* const shared = x25519.getSharedSecret(alice.secretKey, bob.publicKey);
* ```
*/
var x25519 = /* @__PURE__ */ (() => {
	const P = ed25519_CURVE_p;
	const powPminus2 = (x) => {
		const { pow_p_5_8, b2 } = ed25519_pow_2_252_3(x);
		return mod(pow2(pow_p_5_8, _3n, P) * b2, P);
	};
	return montgomery({
		P,
		type: "x25519",
		powPminus2,
		adjustScalarBytes,
		scalarMultBase: (k) => {
			const kn = mod(k, ed25519_Point.Fn.ORDER);
			if (kn === _0n) return _0n;
			const p = ed25519_Point.BASE.multiply(kn);
			return mod((p.Z + p.Y) * powPminus2(mod(p.Z - p.Y, P)), P);
		}
	});
})();
//#endregion
//#region node_modules/@noble/hashes/_blake.js
/**
* Internal blake permutation table.
* Rows `0..9` serve BLAKE2s, rows `0..11` serve BLAKE2b with `10..11 = 0..1`, and Blake1 also
* reuses the later rows shown below. Blake1 expands rounds `10..15` as `SIGMA[i % 10]`, so rows
* `10..15` intentionally repeat rows `0..5` for the 14-round (256) and 16-round (512) variants.
*/
var BSIGMA = /* @__PURE__ */ Uint8Array.from([
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3,
	11,
	8,
	12,
	0,
	5,
	2,
	15,
	13,
	10,
	14,
	3,
	6,
	7,
	1,
	9,
	4,
	7,
	9,
	3,
	1,
	13,
	12,
	11,
	14,
	2,
	6,
	5,
	10,
	4,
	0,
	15,
	8,
	9,
	0,
	5,
	7,
	2,
	4,
	10,
	15,
	14,
	1,
	11,
	12,
	6,
	8,
	3,
	13,
	2,
	12,
	6,
	10,
	0,
	11,
	8,
	3,
	4,
	13,
	7,
	5,
	15,
	14,
	1,
	9,
	12,
	5,
	1,
	15,
	14,
	13,
	4,
	10,
	0,
	7,
	6,
	3,
	9,
	2,
	8,
	11,
	13,
	11,
	7,
	14,
	12,
	1,
	3,
	9,
	5,
	0,
	15,
	4,
	8,
	6,
	2,
	10,
	6,
	15,
	14,
	9,
	11,
	3,
	0,
	8,
	12,
	2,
	13,
	7,
	1,
	4,
	10,
	5,
	10,
	2,
	8,
	4,
	7,
	6,
	1,
	5,
	15,
	11,
	9,
	14,
	3,
	12,
	13,
	0,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3,
	11,
	8,
	12,
	0,
	5,
	2,
	15,
	13,
	10,
	14,
	3,
	6,
	7,
	1,
	9,
	4,
	7,
	9,
	3,
	1,
	13,
	12,
	11,
	14,
	2,
	6,
	5,
	10,
	4,
	0,
	15,
	8,
	9,
	0,
	5,
	7,
	2,
	4,
	10,
	15,
	14,
	1,
	11,
	12,
	6,
	8,
	3,
	13,
	2,
	12,
	6,
	10,
	0,
	11,
	8,
	3,
	4,
	13,
	7,
	5,
	15,
	14,
	1,
	9
]);
//#endregion
//#region node_modules/@noble/hashes/blake2.js
/**
* blake2b (64-bit) & blake2s (8 to 32-bit) hash functions.
* b could have been faster, but there is no fast u64 in js, so s is 1.5x faster.
* @module
*/
var B2B_IV = /* @__PURE__ */ Uint32Array.from([
	4089235720,
	1779033703,
	2227873595,
	3144134277,
	4271175723,
	1013904242,
	1595750129,
	2773480762,
	2917565137,
	1359893119,
	725511199,
	2600822924,
	4215389547,
	528734635,
	327033209,
	1541459225
]);
var BBUF = /* @__PURE__ */ new Uint32Array(32);
function G1b(a, b, c, d, msg, x) {
	const Xl = msg[x], Xh = msg[x + 1];
	let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
	let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
	let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
	let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
	const ll = add3L(Al, Bl, Xl);
	Ah = add3H(ll, Ah, Bh, Xh);
	Al = ll | 0;
	let xh = Dh ^ Ah, xl = Dl ^ Al;
	Dh = rotr32H(xh, xl);
	Dl = rotr32L(xh, xl);
	({h: Ch, l: Cl} = add(Ch, Cl, Dh, Dl));
	xh = Bh ^ Ch;
	xl = Bl ^ Cl;
	Bh = rotrSH(xh, xl, 24);
	Bl = rotrSL(xh, xl, 24);
	BBUF[2 * a] = Al;
	BBUF[2 * a + 1] = Ah;
	BBUF[2 * b] = Bl;
	BBUF[2 * b + 1] = Bh;
	BBUF[2 * c] = Cl;
	BBUF[2 * c + 1] = Ch;
	BBUF[2 * d] = Dl;
	BBUF[2 * d + 1] = Dh;
}
function G2b(a, b, c, d, msg, x) {
	const Xl = msg[x], Xh = msg[x + 1];
	let Al = BBUF[2 * a], Ah = BBUF[2 * a + 1];
	let Bl = BBUF[2 * b], Bh = BBUF[2 * b + 1];
	let Cl = BBUF[2 * c], Ch = BBUF[2 * c + 1];
	let Dl = BBUF[2 * d], Dh = BBUF[2 * d + 1];
	const ll = add3L(Al, Bl, Xl);
	Ah = add3H(ll, Ah, Bh, Xh);
	Al = ll | 0;
	let xh = Dh ^ Ah, xl = Dl ^ Al;
	Dh = rotrSH(xh, xl, 16);
	Dl = rotrSL(xh, xl, 16);
	({h: Ch, l: Cl} = add(Ch, Cl, Dh, Dl));
	xh = Bh ^ Ch;
	xl = Bl ^ Cl;
	Bh = rotrBH(xh, xl, 63);
	Bl = rotrBL(xh, xl, 63);
	BBUF[2 * a] = Al;
	BBUF[2 * a + 1] = Ah;
	BBUF[2 * b] = Bl;
	BBUF[2 * b + 1] = Bh;
	BBUF[2 * c] = Cl;
	BBUF[2 * c + 1] = Ch;
	BBUF[2 * d] = Dl;
	BBUF[2 * d + 1] = Dh;
}
function checkBlake2Opts(outputLen, opts = {}, keyLen, saltLen, persLen) {
	anumber$1(keyLen);
	if (outputLen <= 0 || outputLen > keyLen) throw new Error("\"dkLen\" must be 1.." + keyLen + ", got " + outputLen);
	const { key, salt, personalization } = opts;
	if (key !== void 0 && (key.length < 1 || key.length > keyLen)) throw new Error("\"key\" expected to be undefined or of length=1.." + keyLen);
	if (salt !== void 0) abytes$2(salt, saltLen, "salt");
	if (personalization !== void 0) abytes$2(personalization, persLen, "personalization");
}
/** Internal base class for BLAKE2. */
var _BLAKE2 = class {
	buffer;
	buffer32;
	finished = false;
	destroyed = false;
	length = 0;
	pos = 0;
	blockLen;
	outputLen;
	canXOF = false;
	constructor(blockLen, outputLen) {
		anumber$1(blockLen);
		anumber$1(outputLen);
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.buffer = new Uint8Array(blockLen);
		this.buffer32 = u32(this.buffer);
	}
	update(data) {
		aexists(this);
		abytes$2(data);
		const { blockLen, buffer, buffer32 } = this;
		const len = data.length;
		const offset = data.byteOffset;
		const buf = data.buffer;
		for (let pos = 0; pos < len;) {
			if (this.pos === blockLen) {
				swap32IfBE(buffer32);
				this.compress(buffer32, 0, false);
				swap32IfBE(buffer32);
				this.pos = 0;
			}
			const take = Math.min(blockLen - this.pos, len - pos);
			const dataOffset = offset + pos;
			if (take === blockLen && !(dataOffset % 4) && pos + take < len) {
				const data32 = new Uint32Array(buf, dataOffset, Math.floor((len - pos) / 4));
				swap32IfBE(data32);
				for (let pos32 = 0; pos + blockLen < len; pos32 += buffer32.length, pos += blockLen) {
					this.length += blockLen;
					this.compress(data32, pos32, false);
				}
				swap32IfBE(data32);
				continue;
			}
			buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			this.length += take;
			pos += take;
		}
		return this;
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		if (out.byteOffset & 3) throw new RangeError("\"output\" expected 4-byte aligned byteOffset, got " + out.byteOffset);
		const { pos, buffer32 } = this;
		this.finished = true;
		this.buffer.fill(0, pos);
		swap32IfBE(buffer32);
		this.compress(buffer32, 0, true);
		swap32IfBE(buffer32);
		const state = this.get();
		const out32 = out === this.buffer ? buffer32 : u32(out);
		const full = Math.floor(this.outputLen / 4);
		for (let i = 0; i < full; i++) out32[i] = swap8IfBE(state[i]);
		const tail = this.outputLen % 4;
		if (!tail) return;
		const off = full * 4;
		const word = state[full];
		for (let i = 0; i < tail; i++) out[off + i] = word >>> 8 * i;
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		const { buffer, length, finished, destroyed, outputLen, pos } = this;
		to ||= new this.constructor({ dkLen: outputLen });
		to.set(...this.get());
		to.buffer.set(buffer);
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		to.outputLen = outputLen;
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/** Internal blake2b hash class with state stored as LE u32 low/high halves. */
var _BLAKE2b = class extends _BLAKE2 {
	v0l = B2B_IV[0] | 0;
	v0h = B2B_IV[1] | 0;
	v1l = B2B_IV[2] | 0;
	v1h = B2B_IV[3] | 0;
	v2l = B2B_IV[4] | 0;
	v2h = B2B_IV[5] | 0;
	v3l = B2B_IV[6] | 0;
	v3h = B2B_IV[7] | 0;
	v4l = B2B_IV[8] | 0;
	v4h = B2B_IV[9] | 0;
	v5l = B2B_IV[10] | 0;
	v5h = B2B_IV[11] | 0;
	v6l = B2B_IV[12] | 0;
	v6h = B2B_IV[13] | 0;
	v7l = B2B_IV[14] | 0;
	v7h = B2B_IV[15] | 0;
	constructor(opts = {}) {
		opts = checkOpts({}, opts);
		const olen = opts.dkLen === void 0 ? 64 : opts.dkLen;
		super(128, olen);
		checkBlake2Opts(olen, opts, 64, 16, 16);
		let { key, personalization, salt } = opts;
		let keyLength = 0;
		if (key !== void 0) {
			abytes$2(key, void 0, "key");
			keyLength = key.length;
		}
		this.v0l ^= this.outputLen | keyLength << 8 | 16842752;
		if (salt !== void 0) {
			abytes$2(salt, void 0, "salt");
			const slt = u32(copyBytes$1(salt));
			this.v4l ^= swap8IfBE(slt[0]);
			this.v4h ^= swap8IfBE(slt[1]);
			this.v5l ^= swap8IfBE(slt[2]);
			this.v5h ^= swap8IfBE(slt[3]);
		}
		if (personalization !== void 0) {
			abytes$2(personalization, void 0, "personalization");
			const pers = u32(copyBytes$1(personalization));
			this.v6l ^= swap8IfBE(pers[0]);
			this.v6h ^= swap8IfBE(pers[1]);
			this.v7l ^= swap8IfBE(pers[2]);
			this.v7h ^= swap8IfBE(pers[3]);
		}
		if (key !== void 0) {
			const tmp = new Uint8Array(this.blockLen);
			tmp.set(key);
			this.update(tmp);
			clean(tmp);
		}
	}
	get() {
		let { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
		return [
			v0l,
			v0h,
			v1l,
			v1h,
			v2l,
			v2h,
			v3l,
			v3h,
			v4l,
			v4h,
			v5l,
			v5h,
			v6l,
			v6h,
			v7l,
			v7h
		];
	}
	set(v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h) {
		this.v0l = v0l | 0;
		this.v0h = v0h | 0;
		this.v1l = v1l | 0;
		this.v1h = v1h | 0;
		this.v2l = v2l | 0;
		this.v2h = v2h | 0;
		this.v3l = v3l | 0;
		this.v3h = v3h | 0;
		this.v4l = v4l | 0;
		this.v4h = v4h | 0;
		this.v5l = v5l | 0;
		this.v5h = v5h | 0;
		this.v6l = v6l | 0;
		this.v6h = v6h | 0;
		this.v7l = v7l | 0;
		this.v7h = v7h | 0;
	}
	compress(msg, offset, isLast) {
		const { v0l, v0h, v1l, v1h, v2l, v2h, v3l, v3h, v4l, v4h, v5l, v5h, v6l, v6h, v7l, v7h } = this;
		BBUF[0] = v0l;
		BBUF[1] = v0h;
		BBUF[2] = v1l;
		BBUF[3] = v1h;
		BBUF[4] = v2l;
		BBUF[5] = v2h;
		BBUF[6] = v3l;
		BBUF[7] = v3h;
		BBUF[8] = v4l;
		BBUF[9] = v4h;
		BBUF[10] = v5l;
		BBUF[11] = v5h;
		BBUF[12] = v6l;
		BBUF[13] = v6h;
		BBUF[14] = v7l;
		BBUF[15] = v7h;
		BBUF.set(B2B_IV, 16);
		const l = fromNumL(this.length);
		const h = fromNumH(this.length);
		BBUF[24] = B2B_IV[8] ^ l;
		BBUF[25] = B2B_IV[9] ^ h;
		if (isLast) {
			BBUF[28] = ~BBUF[28];
			BBUF[29] = ~BBUF[29];
		}
		let j = 0;
		const s = BSIGMA;
		for (let i = 0; i < 12; i++) {
			G1b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
			G2b(0, 4, 8, 12, msg, offset + 2 * s[j++]);
			G1b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
			G2b(1, 5, 9, 13, msg, offset + 2 * s[j++]);
			G1b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
			G2b(2, 6, 10, 14, msg, offset + 2 * s[j++]);
			G1b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
			G2b(3, 7, 11, 15, msg, offset + 2 * s[j++]);
			G1b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
			G2b(0, 5, 10, 15, msg, offset + 2 * s[j++]);
			G1b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
			G2b(1, 6, 11, 12, msg, offset + 2 * s[j++]);
			G1b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
			G2b(2, 7, 8, 13, msg, offset + 2 * s[j++]);
			G1b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
			G2b(3, 4, 9, 14, msg, offset + 2 * s[j++]);
		}
		this.v0l ^= BBUF[0] ^ BBUF[16];
		this.v0h ^= BBUF[1] ^ BBUF[17];
		this.v1l ^= BBUF[2] ^ BBUF[18];
		this.v1h ^= BBUF[3] ^ BBUF[19];
		this.v2l ^= BBUF[4] ^ BBUF[20];
		this.v2h ^= BBUF[5] ^ BBUF[21];
		this.v3l ^= BBUF[6] ^ BBUF[22];
		this.v3h ^= BBUF[7] ^ BBUF[23];
		this.v4l ^= BBUF[8] ^ BBUF[24];
		this.v4h ^= BBUF[9] ^ BBUF[25];
		this.v5l ^= BBUF[10] ^ BBUF[26];
		this.v5h ^= BBUF[11] ^ BBUF[27];
		this.v6l ^= BBUF[12] ^ BBUF[28];
		this.v6h ^= BBUF[13] ^ BBUF[29];
		this.v7l ^= BBUF[14] ^ BBUF[30];
		this.v7h ^= BBUF[15] ^ BBUF[31];
		clean(BBUF);
	}
	destroy() {
		this.destroyed = true;
		clean(this.buffer32);
		this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	}
};
/**
* Blake2b hash function. 64-bit. 1.5x slower than blake2s in JS.
* @param msg - message that would be hashed
* @param opts - Optional output, MAC, salt, and personalization settings.
*   `dkLen` must be 1..64 bytes; `salt` and `personalization`, if present,
*   must be 16 bytes each. See {@link Blake2Opts}.
* @returns Digest bytes.
* @example
* Hash a message with Blake2b.
* ```ts
* blake2b(new Uint8Array([97, 98, 99]));
* ```
* @example
* Hash a message with Blake2b while selecting output, MAC, salt, and personalization settings.
* ```ts
* blake2b(new Uint8Array([97, 98, 99]), {
*   dkLen: 32,
*   key: new Uint8Array(32),
*   salt: new Uint8Array(16),
*   personalization: new Uint8Array(16),
* });
* ```
*/
var blake2b = /* @__PURE__ */ createHasher((opts) => new _BLAKE2b(opts));
//#endregion
//#region node_modules/@algorandfoundation/xhd-wallet-api/dist/sumo.facade.js
var crypto_scalarmult_ed25519_SCALARBYTES = 32;
var crypto_scalarmult_x25519_SCALARBYTES = 32;
var crypto_scalarmult_x25519_PKBYTES = 32;
var crypto_generichash_BYTES_MIN = 16;
var crypto_generichash_BYTES_MAX = 64;
var crypto_core_ed25519_NONREDUCEDSCALARBYTES = 64;
/**
* Verify a detached signature
*/
function crypto_sign_verify_detached(signature, message, publicKey) {
	try {
		return ed25519.verify(signature, message, publicKey);
	} catch (error) {
		return false;
	}
}
/**
* Scalar multiplication with base point (no clamping)
*/
function crypto_scalarmult_ed25519_base_noclamp(scalar) {
	if (scalar.length !== crypto_scalarmult_ed25519_SCALARBYTES) throw new Error(`scalar must be ${crypto_scalarmult_ed25519_SCALARBYTES} bytes`);
	const reducedScalar = mod(bytesToNumberLE(scalar) & (1n << 255n) - 1n, ed25519.Point.Fn.ORDER);
	if (reducedScalar === 0n) throw new Error("scalar is 0");
	return ed25519.Point.BASE.multiply(reducedScalar).toBytes();
}
/**
* Add two scalars modulo the curve order
*/
function crypto_core_ed25519_scalar_add(scalarA, scalarB) {
	if (scalarA.length !== crypto_scalarmult_ed25519_SCALARBYTES || scalarB.length !== crypto_scalarmult_ed25519_SCALARBYTES) throw new Error(`scalars must be ${crypto_scalarmult_ed25519_SCALARBYTES} bytes`);
	const sum = bytesToNumberLE(scalarA) + bytesToNumberLE(scalarB);
	if (sum < 0n || sum > (1n << 64n * 8n) - 1n) throw new Error("resulting sum scalar is invalid");
	const result = numberToBytesLE(mod(sum, ed25519.Point.Fn.ORDER), crypto_scalarmult_ed25519_SCALARBYTES);
	if (result.length !== crypto_scalarmult_ed25519_SCALARBYTES) throw new Error("resulting scalar has invalid length");
	return result;
}
/**
* Multiply two scalars modulo the curve order
*/
function crypto_core_ed25519_scalar_mul(scalarA, scalarB) {
	if (scalarA.length !== crypto_scalarmult_ed25519_SCALARBYTES || scalarB.length !== crypto_scalarmult_ed25519_SCALARBYTES) throw new Error(`scalars must be ${crypto_scalarmult_ed25519_SCALARBYTES} bytes`);
	const result = numberToBytesLE(mod(bytesToNumberLE(scalarA) * bytesToNumberLE(scalarB), ed25519.Point.Fn.ORDER), crypto_scalarmult_ed25519_SCALARBYTES);
	if (result.length !== crypto_scalarmult_ed25519_SCALARBYTES) throw new Error("resulting scalar has invalid length");
	return result;
}
/**
* Reduce a scalar modulo the curve order
*/
function crypto_core_ed25519_scalar_reduce(scalar) {
	if (scalar.length > crypto_core_ed25519_NONREDUCEDSCALARBYTES) throw new Error(`scalar must be at most ${crypto_core_ed25519_NONREDUCEDSCALARBYTES} bytes`);
	const result = numberToBytesLE(mod(bytesToNumberLE(scalar), ed25519.Point.Fn.ORDER), crypto_scalarmult_ed25519_SCALARBYTES);
	if (result.length !== crypto_scalarmult_ed25519_SCALARBYTES) throw new Error("resulting scalar has invalid length");
	return result;
}
/**
* X25519 scalar multiplication
*/
function crypto_scalarmult(privateKey, publicKey) {
	if (privateKey.length !== crypto_scalarmult_x25519_SCALARBYTES || publicKey.length !== crypto_scalarmult_x25519_PKBYTES) throw new Error("x25519 private and public keys must be 32 bytes each");
	const clampedKey = new Uint8Array(privateKey);
	clampedKey[0] &= 248;
	clampedKey[31] &= 127;
	clampedKey[31] |= 64;
	return x25519.getSharedSecret(clampedKey, publicKey);
}
/**
* Convert Ed25519 public key to X25519 public key
*/
function crypto_sign_ed25519_pk_to_curve25519(edPubKey) {
	return ed25519.utils.toMontgomery(edPubKey);
}
/**
* SHA-512 hash function
*/
function crypto_hash_sha512(message) {
	return sha512(message);
}
/**
* BLAKE2b hash function (generic hash)
* Matches libsodium signature: crypto_generichash(outputLength, message, key?)
*/
function crypto_generichash(outputLength, message, key = null) {
	if (outputLength < crypto_generichash_BYTES_MIN || outputLength > crypto_generichash_BYTES_MAX) throw new Error(`output length must be between ${crypto_generichash_BYTES_MIN} and ${crypto_generichash_BYTES_MAX} bytes`);
	if (key) return blake2b(message, {
		key,
		dkLen: outputLength
	});
	return blake2b(message, { dkLen: outputLength });
}
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/utils/utf8.js
var require_utf8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.utf8DecodeTD = exports.TEXT_DECODER_THRESHOLD = exports.utf8DecodeJs = exports.utf8EncodeTE = exports.TEXT_ENCODER_THRESHOLD = exports.utf8EncodeJs = exports.utf8Count = exports.TEXT_ENCODING_AVAILABLE = void 0;
	exports.TEXT_ENCODING_AVAILABLE = typeof process !== "undefined" && process.env.TEXT_ENCODING !== "never" && typeof TextEncoder !== "undefined" && typeof TextDecoder !== "undefined";
	function utf8Count(str) {
		const strLength = str.length;
		let byteLength = 0;
		let pos = 0;
		while (pos < strLength) {
			let value = str.charCodeAt(pos++);
			if ((value & 4294967168) === 0) {
				byteLength++;
				continue;
			} else if ((value & 4294965248) === 0) byteLength += 2;
			else {
				if (value >= 55296 && value <= 56319) {
					if (pos < strLength) {
						const extra = str.charCodeAt(pos);
						if ((extra & 64512) === 56320) {
							++pos;
							value = ((value & 1023) << 10) + (extra & 1023) + 65536;
						}
					}
				}
				if ((value & 4294901760) === 0) byteLength += 3;
				else byteLength += 4;
			}
		}
		return byteLength;
	}
	exports.utf8Count = utf8Count;
	function utf8EncodeJs(str, output, outputOffset) {
		const strLength = str.length;
		let offset = outputOffset;
		let pos = 0;
		while (pos < strLength) {
			let value = str.charCodeAt(pos++);
			if ((value & 4294967168) === 0) {
				output[offset++] = value;
				continue;
			} else if ((value & 4294965248) === 0) output[offset++] = value >> 6 & 31 | 192;
			else {
				if (value >= 55296 && value <= 56319) {
					if (pos < strLength) {
						const extra = str.charCodeAt(pos);
						if ((extra & 64512) === 56320) {
							++pos;
							value = ((value & 1023) << 10) + (extra & 1023) + 65536;
						}
					}
				}
				if ((value & 4294901760) === 0) {
					output[offset++] = value >> 12 & 15 | 224;
					output[offset++] = value >> 6 & 63 | 128;
				} else {
					output[offset++] = value >> 18 & 7 | 240;
					output[offset++] = value >> 12 & 63 | 128;
					output[offset++] = value >> 6 & 63 | 128;
				}
			}
			output[offset++] = value & 63 | 128;
		}
	}
	exports.utf8EncodeJs = utf8EncodeJs;
	var sharedTextEncoder = exports.TEXT_ENCODING_AVAILABLE ? new TextEncoder() : void 0;
	exports.TEXT_ENCODER_THRESHOLD = typeof process !== "undefined" && process.env.TEXT_ENCODING !== "force" ? 200 : 0;
	function utf8EncodeTEencode(str, output, outputOffset) {
		output.set(sharedTextEncoder.encode(str), outputOffset);
	}
	function utf8EncodeTEencodeInto(str, output, outputOffset) {
		sharedTextEncoder.encodeInto(str, output.subarray(outputOffset));
	}
	exports.utf8EncodeTE = (sharedTextEncoder === null || sharedTextEncoder === void 0 ? void 0 : sharedTextEncoder.encodeInto) ? utf8EncodeTEencodeInto : utf8EncodeTEencode;
	var CHUNK_SIZE = 4096;
	function utf8DecodeJs(bytes, inputOffset, byteLength) {
		let offset = inputOffset;
		const end = offset + byteLength;
		const units = [];
		let result = "";
		while (offset < end) {
			const byte1 = bytes[offset++];
			if ((byte1 & 128) === 0) units.push(byte1);
			else if ((byte1 & 224) === 192) {
				const byte2 = bytes[offset++] & 63;
				units.push((byte1 & 31) << 6 | byte2);
			} else if ((byte1 & 240) === 224) {
				const byte2 = bytes[offset++] & 63;
				const byte3 = bytes[offset++] & 63;
				units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
			} else if ((byte1 & 248) === 240) {
				const byte2 = bytes[offset++] & 63;
				const byte3 = bytes[offset++] & 63;
				const byte4 = bytes[offset++] & 63;
				let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
				if (unit > 65535) {
					unit -= 65536;
					units.push(unit >>> 10 & 1023 | 55296);
					unit = 56320 | unit & 1023;
				}
				units.push(unit);
			} else units.push(byte1);
			if (units.length >= CHUNK_SIZE) {
				result += String.fromCharCode(...units);
				units.length = 0;
			}
		}
		if (units.length > 0) result += String.fromCharCode(...units);
		return result;
	}
	exports.utf8DecodeJs = utf8DecodeJs;
	var sharedTextDecoder = exports.TEXT_ENCODING_AVAILABLE ? new TextDecoder() : null;
	exports.TEXT_DECODER_THRESHOLD = typeof process !== "undefined" && process.env.TEXT_DECODER !== "force" ? 200 : 0;
	function utf8DecodeTD(bytes, inputOffset, byteLength) {
		const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
		return sharedTextDecoder.decode(stringBytes);
	}
	exports.utf8DecodeTD = utf8DecodeTD;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/ExtData.js
var require_ExtData = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExtData = void 0;
	/**
	* ExtData is used to handle Extension Types that are not registered to ExtensionCodec.
	*/
	var ExtData = class {
		constructor(type, data) {
			this.type = type;
			this.data = data;
		}
	};
	exports.ExtData = ExtData;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/utils/int.js
var require_int = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getUint64 = exports.getInt64 = exports.setBigInt64 = exports.setInt64 = exports.setUint64 = void 0;
	function setUint64(view, offset, value) {
		const high = value / 4294967296;
		const low = value;
		view.setUint32(offset, high);
		view.setUint32(offset + 4, low);
	}
	exports.setUint64 = setUint64;
	function setInt64(view, offset, value) {
		const high = Math.floor(value / 4294967296);
		const low = value;
		view.setUint32(offset, high);
		view.setUint32(offset + 4, low);
	}
	exports.setInt64 = setInt64;
	function setBigInt64(view, offset, value) {
		let high = Number(value / BigInt(4294967296));
		const low = Number(value % BigInt(4294967296));
		if (high < 0 && low !== 0) high -= 1;
		view.setUint32(offset, high);
		view.setUint32(offset + 4, low);
	}
	exports.setBigInt64 = setBigInt64;
	function getInt64(view, offset) {
		const high = view.getInt32(offset);
		const low = view.getUint32(offset + 4);
		const exceeds_min_safe_int = high < Math.floor(Number.MIN_SAFE_INTEGER / 4294967296) || high === Math.floor(Number.MIN_SAFE_INTEGER / 4294967296) && low === 0;
		const exceeds_max_safe_int = high > Math.floor(Number.MAX_SAFE_INTEGER / 4294967296);
		if (exceeds_min_safe_int || exceeds_max_safe_int) return BigInt(high) * BigInt(4294967296) + BigInt(low);
		return high * 4294967296 + low;
	}
	exports.getInt64 = getInt64;
	function getUint64(view, offset) {
		const high = view.getUint32(offset);
		const low = view.getUint32(offset + 4);
		if (high > Math.floor(Number.MAX_SAFE_INTEGER / 4294967296)) return BigInt(high) * BigInt(4294967296) + BigInt(low);
		return high * 4294967296 + low;
	}
	exports.getUint64 = getUint64;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/timestamp.js
var require_timestamp = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timestampExtension = exports.decodeTimestampExtension = exports.decodeTimestampToTimeSpec = exports.encodeTimestampExtension = exports.encodeDateToTimeSpec = exports.encodeTimeSpecToTimestamp = exports.EXT_TIMESTAMP = void 0;
	var int_1 = require_int();
	exports.EXT_TIMESTAMP = -1;
	var TIMESTAMP32_MAX_SEC = 4294967295;
	var TIMESTAMP64_MAX_SEC = 17179869183;
	function encodeTimeSpecToTimestamp({ sec, nsec }) {
		if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
			if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
				const rv = /* @__PURE__ */ new Uint8Array(4);
				new DataView(rv.buffer).setUint32(0, sec);
				return rv;
			} else {
				const secHigh = sec / 4294967296;
				const secLow = sec & 4294967295;
				const rv = /* @__PURE__ */ new Uint8Array(8);
				const view = new DataView(rv.buffer);
				view.setUint32(0, nsec << 2 | secHigh & 3);
				view.setUint32(4, secLow);
				return rv;
			}
		} else {
			const rv = /* @__PURE__ */ new Uint8Array(12);
			const view = new DataView(rv.buffer);
			view.setUint32(0, nsec);
			int_1.setInt64(view, 4, sec);
			return rv;
		}
	}
	exports.encodeTimeSpecToTimestamp = encodeTimeSpecToTimestamp;
	function encodeDateToTimeSpec(date) {
		const msec = date.getTime();
		const sec = Math.floor(msec / 1e3);
		const nsec = (msec - sec * 1e3) * 1e6;
		const nsecInSec = Math.floor(nsec / 1e9);
		return {
			sec: sec + nsecInSec,
			nsec: nsec - nsecInSec * 1e9
		};
	}
	exports.encodeDateToTimeSpec = encodeDateToTimeSpec;
	function encodeTimestampExtension(object) {
		if (object instanceof Date) return encodeTimeSpecToTimestamp(encodeDateToTimeSpec(object));
		else return null;
	}
	exports.encodeTimestampExtension = encodeTimestampExtension;
	function decodeTimestampToTimeSpec(data) {
		const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
		switch (data.byteLength) {
			case 4: return {
				sec: view.getUint32(0),
				nsec: 0
			};
			case 8: {
				const nsec30AndSecHigh2 = view.getUint32(0);
				const secLow32 = view.getUint32(4);
				return {
					sec: (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32,
					nsec: nsec30AndSecHigh2 >>> 2
				};
			}
			case 12: return {
				sec: int_1.getInt64(view, 4),
				nsec: view.getUint32(0)
			};
			default: throw new Error(`Unrecognized data size for timestamp: ${data.length}`);
		}
	}
	exports.decodeTimestampToTimeSpec = decodeTimestampToTimeSpec;
	function decodeTimestampExtension(data) {
		const timeSpec = decodeTimestampToTimeSpec(data);
		return /* @__PURE__ */ new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
	}
	exports.decodeTimestampExtension = decodeTimestampExtension;
	exports.timestampExtension = {
		type: exports.EXT_TIMESTAMP,
		encode: encodeTimestampExtension,
		decode: decodeTimestampExtension
	};
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/ExtensionCodec.js
var require_ExtensionCodec = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ExtensionCodec = void 0;
	var ExtData_1 = require_ExtData();
	var timestamp_1 = require_timestamp();
	var ExtensionCodec = class {
		constructor() {
			this.builtInEncoders = [];
			this.builtInDecoders = [];
			this.encoders = [];
			this.decoders = [];
			this.register(timestamp_1.timestampExtension);
		}
		register({ type, encode, decode }) {
			if (type >= 0) {
				this.encoders[type] = encode;
				this.decoders[type] = decode;
			} else {
				const index = 1 + type;
				this.builtInEncoders[index] = encode;
				this.builtInDecoders[index] = decode;
			}
		}
		tryToEncode(object, context) {
			for (let i = 0; i < this.builtInEncoders.length; i++) {
				const encoder = this.builtInEncoders[i];
				if (encoder != null) {
					const data = encoder(object, context);
					if (data != null) {
						const type = -1 - i;
						return new ExtData_1.ExtData(type, data);
					}
				}
			}
			for (let i = 0; i < this.encoders.length; i++) {
				const encoder = this.encoders[i];
				if (encoder != null) {
					const data = encoder(object, context);
					if (data != null) {
						const type = i;
						return new ExtData_1.ExtData(type, data);
					}
				}
			}
			if (object instanceof ExtData_1.ExtData) return object;
			return null;
		}
		decode(data, type, context) {
			const decoder = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
			if (decoder) return decoder(data, type, context);
			else return new ExtData_1.ExtData(type, data);
		}
	};
	exports.ExtensionCodec = ExtensionCodec;
	ExtensionCodec.defaultCodec = new ExtensionCodec();
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/utils/typedArrays.js
var require_typedArrays = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDataView = exports.ensureUint8Array = void 0;
	function ensureUint8Array(buffer) {
		if (buffer instanceof Uint8Array) return buffer;
		else if (ArrayBuffer.isView(buffer)) return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
		else if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
		else return Uint8Array.from(buffer);
	}
	exports.ensureUint8Array = ensureUint8Array;
	function createDataView(buffer) {
		if (buffer instanceof ArrayBuffer) return new DataView(buffer);
		const bufferView = ensureUint8Array(buffer);
		return new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
	}
	exports.createDataView = createDataView;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/Encoder.js
var require_Encoder = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Encoder = exports.DEFAULT_INITIAL_BUFFER_SIZE = exports.DEFAULT_MAX_DEPTH = void 0;
	var utf8_1 = require_utf8();
	var ExtensionCodec_1 = require_ExtensionCodec();
	var int_1 = require_int();
	var typedArrays_1 = require_typedArrays();
	exports.DEFAULT_MAX_DEPTH = 100;
	exports.DEFAULT_INITIAL_BUFFER_SIZE = 2048;
	var Encoder = class {
		constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context = void 0, maxDepth = exports.DEFAULT_MAX_DEPTH, initialBufferSize = exports.DEFAULT_INITIAL_BUFFER_SIZE, sortKeys = false, forceFloat32 = false, ignoreUndefined = false, forceIntegerToFloat = false) {
			this.extensionCodec = extensionCodec;
			this.context = context;
			this.maxDepth = maxDepth;
			this.initialBufferSize = initialBufferSize;
			this.sortKeys = sortKeys;
			this.forceFloat32 = forceFloat32;
			this.ignoreUndefined = ignoreUndefined;
			this.forceIntegerToFloat = forceIntegerToFloat;
			this.pos = 0;
			this.view = new DataView(new ArrayBuffer(this.initialBufferSize));
			this.bytes = new Uint8Array(this.view.buffer);
		}
		getUint8Array() {
			return this.bytes.subarray(0, this.pos);
		}
		reinitializeState() {
			this.pos = 0;
		}
		encode(object) {
			this.reinitializeState();
			this.doEncode(object, 1);
			return this.getUint8Array();
		}
		doEncode(object, depth) {
			if (depth > this.maxDepth) throw new Error(`Too deep objects in depth ${depth}`);
			if (object == null) this.encodeNil();
			else if (typeof object === "boolean") this.encodeBoolean(object);
			else if (typeof object === "number") this.encodeNumber(object);
			else if (typeof object === "string") this.encodeString(object);
			else if (typeof object === "bigint") this.encodebigint(object);
			else this.encodeObject(object, depth);
		}
		ensureBufferSizeToWrite(sizeToWrite) {
			const requiredSize = this.pos + sizeToWrite;
			if (this.view.byteLength < requiredSize) this.resizeBuffer(requiredSize * 2);
		}
		resizeBuffer(newSize) {
			const newBuffer = new ArrayBuffer(newSize);
			const newBytes = new Uint8Array(newBuffer);
			const newView = new DataView(newBuffer);
			newBytes.set(this.bytes);
			this.view = newView;
			this.bytes = newBytes;
		}
		encodeNil() {
			this.writeU8(192);
		}
		encodeBoolean(object) {
			if (object === false) this.writeU8(194);
			else this.writeU8(195);
		}
		encodeNumber(object) {
			if (Number.isSafeInteger(object) && !this.forceIntegerToFloat) {
				if (object >= 0) {
					if (object < 128) this.writeU8(object);
					else if (object < 256) {
						this.writeU8(204);
						this.writeU8(object);
					} else if (object < 65536) {
						this.writeU8(205);
						this.writeU16(object);
					} else if (object < 4294967296) {
						this.writeU8(206);
						this.writeU32(object);
					} else {
						this.writeU8(207);
						this.writeU64(object);
					}
				} else if (object >= -32) this.writeU8(224 | object + 32);
				else if (object >= -128) {
					this.writeU8(208);
					this.writeI8(object);
				} else if (object >= -32768) {
					this.writeU8(209);
					this.writeI16(object);
				} else if (object >= -2147483648) {
					this.writeU8(210);
					this.writeI32(object);
				} else {
					this.writeU8(211);
					this.writeI64(object);
				}
			} else if (this.forceFloat32) {
				this.writeU8(202);
				this.writeF32(object);
			} else {
				this.writeU8(203);
				this.writeF64(object);
			}
		}
		encodebigint(object) {
			if (object >= BigInt(0)) {
				if (object < BigInt(128)) this.writeU8(Number(object));
				else if (object < BigInt(256)) {
					this.writeU8(204);
					this.writeU8(Number(object));
				} else if (object < BigInt(65536)) {
					this.writeU8(205);
					this.writeU16(Number(object));
				} else if (object < BigInt(4294967296)) {
					this.writeU8(206);
					this.writeU32(Number(object));
				} else {
					this.writeU8(207);
					this.writeBig64(object);
				}
			} else if (object >= BigInt(-32)) this.writeU8(224 | Number(object) + 32);
			else if (object >= BigInt(-128)) {
				this.writeU8(208);
				this.writeI8(Number(object));
			} else if (object >= BigInt(-32768)) {
				this.writeU8(209);
				this.writeI16(Number(object));
			} else if (object >= BigInt(-2147483648)) {
				this.writeU8(210);
				this.writeI32(Number(object));
			} else {
				this.writeU8(211);
				this.writeBig64(object);
			}
		}
		writeStringHeader(byteLength) {
			if (byteLength < 32) this.writeU8(160 + byteLength);
			else if (byteLength < 256) {
				this.writeU8(217);
				this.writeU8(byteLength);
			} else if (byteLength < 65536) {
				this.writeU8(218);
				this.writeU16(byteLength);
			} else if (byteLength < 4294967296) {
				this.writeU8(219);
				this.writeU32(byteLength);
			} else throw new Error(`Too long string: ${byteLength} bytes in UTF-8`);
		}
		encodeString(object) {
			const maxHeaderSize = 5;
			const strLength = object.length;
			if (utf8_1.TEXT_ENCODING_AVAILABLE && strLength > utf8_1.TEXT_ENCODER_THRESHOLD) {
				const byteLength = utf8_1.utf8Count(object);
				this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
				this.writeStringHeader(byteLength);
				utf8_1.utf8EncodeTE(object, this.bytes, this.pos);
				this.pos += byteLength;
			} else {
				const byteLength = utf8_1.utf8Count(object);
				this.ensureBufferSizeToWrite(maxHeaderSize + byteLength);
				this.writeStringHeader(byteLength);
				utf8_1.utf8EncodeJs(object, this.bytes, this.pos);
				this.pos += byteLength;
			}
		}
		encodeObject(object, depth) {
			const ext = this.extensionCodec.tryToEncode(object, this.context);
			if (ext != null) this.encodeExtension(ext);
			else if (Array.isArray(object)) this.encodeArray(object, depth);
			else if (ArrayBuffer.isView(object)) this.encodeBinary(object);
			else if (typeof object === "object") this.encodeMap(object, depth);
			else throw new Error(`Unrecognized object: ${Object.prototype.toString.apply(object)}`);
		}
		encodeBinary(object) {
			const size = object.byteLength;
			if (size < 256) {
				this.writeU8(196);
				this.writeU8(size);
			} else if (size < 65536) {
				this.writeU8(197);
				this.writeU16(size);
			} else if (size < 4294967296) {
				this.writeU8(198);
				this.writeU32(size);
			} else throw new Error(`Too large binary: ${size}`);
			const bytes = typedArrays_1.ensureUint8Array(object);
			this.writeU8a(bytes);
		}
		encodeArray(object, depth) {
			const size = object.length;
			if (size < 16) this.writeU8(144 + size);
			else if (size < 65536) {
				this.writeU8(220);
				this.writeU16(size);
			} else if (size < 4294967296) {
				this.writeU8(221);
				this.writeU32(size);
			} else throw new Error(`Too large array: ${size}`);
			for (const item of object) this.doEncode(item, depth + 1);
		}
		countWithoutUndefined(object, keys) {
			let count = 0;
			for (const key of keys) if (object[key] !== void 0) count++;
			return count;
		}
		encodeMap(object, depth) {
			const keys = Object.keys(object);
			if (this.sortKeys) keys.sort();
			const size = this.ignoreUndefined ? this.countWithoutUndefined(object, keys) : keys.length;
			if (size < 16) this.writeU8(128 + size);
			else if (size < 65536) {
				this.writeU8(222);
				this.writeU16(size);
			} else if (size < 4294967296) {
				this.writeU8(223);
				this.writeU32(size);
			} else throw new Error(`Too large map object: ${size}`);
			for (const key of keys) {
				const value = object[key];
				if (!(this.ignoreUndefined && value === void 0)) {
					this.encodeString(key);
					this.doEncode(value, depth + 1);
				}
			}
		}
		encodeExtension(ext) {
			const size = ext.data.length;
			if (size === 1) this.writeU8(212);
			else if (size === 2) this.writeU8(213);
			else if (size === 4) this.writeU8(214);
			else if (size === 8) this.writeU8(215);
			else if (size === 16) this.writeU8(216);
			else if (size < 256) {
				this.writeU8(199);
				this.writeU8(size);
			} else if (size < 65536) {
				this.writeU8(200);
				this.writeU16(size);
			} else if (size < 4294967296) {
				this.writeU8(201);
				this.writeU32(size);
			} else throw new Error(`Too large extension object: ${size}`);
			this.writeI8(ext.type);
			this.writeU8a(ext.data);
		}
		writeU8(value) {
			this.ensureBufferSizeToWrite(1);
			this.view.setUint8(this.pos, value);
			this.pos++;
		}
		writeU8a(values) {
			const size = values.length;
			this.ensureBufferSizeToWrite(size);
			this.bytes.set(values, this.pos);
			this.pos += size;
		}
		writeI8(value) {
			this.ensureBufferSizeToWrite(1);
			this.view.setInt8(this.pos, value);
			this.pos++;
		}
		writeU16(value) {
			this.ensureBufferSizeToWrite(2);
			this.view.setUint16(this.pos, value);
			this.pos += 2;
		}
		writeI16(value) {
			this.ensureBufferSizeToWrite(2);
			this.view.setInt16(this.pos, value);
			this.pos += 2;
		}
		writeU32(value) {
			this.ensureBufferSizeToWrite(4);
			this.view.setUint32(this.pos, value);
			this.pos += 4;
		}
		writeI32(value) {
			this.ensureBufferSizeToWrite(4);
			this.view.setInt32(this.pos, value);
			this.pos += 4;
		}
		writeF32(value) {
			this.ensureBufferSizeToWrite(4);
			this.view.setFloat32(this.pos, value);
			this.pos += 4;
		}
		writeF64(value) {
			this.ensureBufferSizeToWrite(8);
			this.view.setFloat64(this.pos, value);
			this.pos += 8;
		}
		writeU64(value) {
			this.ensureBufferSizeToWrite(8);
			int_1.setUint64(this.view, this.pos, value);
			this.pos += 8;
		}
		writeI64(value) {
			this.ensureBufferSizeToWrite(8);
			int_1.setInt64(this.view, this.pos, value);
			this.pos += 8;
		}
		writeBig64(value) {
			this.ensureBufferSizeToWrite(8);
			int_1.setBigInt64(this.view, this.pos, value);
			this.pos += 8;
		}
	};
	exports.Encoder = Encoder;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/encode.js
var require_encode = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.encode = void 0;
	var Encoder_1 = require_Encoder();
	var defaultEncodeOptions = {};
	/**
	* It encodes `value` in the MessagePack format and
	* returns a byte buffer.
	*
	* The returned buffer is a slice of a larger `ArrayBuffer`, so you have to use its `#byteOffset` and `#byteLength` in order to convert it to another typed arrays including NodeJS `Buffer`.
	*/
	function encode(value, options = defaultEncodeOptions) {
		return new Encoder_1.Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined, options.forceIntegerToFloat).encode(value);
	}
	exports.encode = encode;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/utils/prettyByte.js
var require_prettyByte = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.prettyByte = void 0;
	function prettyByte(byte) {
		return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
	}
	exports.prettyByte = prettyByte;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/CachedKeyDecoder.js
var require_CachedKeyDecoder = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CachedKeyDecoder = void 0;
	var utf8_1 = require_utf8();
	var DEFAULT_MAX_KEY_LENGTH = 16;
	var DEFAULT_MAX_LENGTH_PER_KEY = 16;
	var CachedKeyDecoder = class {
		constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
			this.maxKeyLength = maxKeyLength;
			this.maxLengthPerKey = maxLengthPerKey;
			this.hit = 0;
			this.miss = 0;
			this.caches = [];
			for (let i = 0; i < this.maxKeyLength; i++) this.caches.push([]);
		}
		canBeCached(byteLength) {
			return byteLength > 0 && byteLength <= this.maxKeyLength;
		}
		get(bytes, inputOffset, byteLength) {
			const records = this.caches[byteLength - 1];
			const recordsLength = records.length;
			FIND_CHUNK: for (let i = 0; i < recordsLength; i++) {
				const record = records[i];
				const recordBytes = record.bytes;
				for (let j = 0; j < byteLength; j++) if (recordBytes[j] !== bytes[inputOffset + j]) continue FIND_CHUNK;
				return record.value;
			}
			return null;
		}
		store(bytes, value) {
			const records = this.caches[bytes.length - 1];
			const record = {
				bytes,
				value
			};
			if (records.length >= this.maxLengthPerKey) records[Math.random() * records.length | 0] = record;
			else records.push(record);
		}
		decode(bytes, inputOffset, byteLength) {
			const cachedValue = this.get(bytes, inputOffset, byteLength);
			if (cachedValue != null) {
				this.hit++;
				return cachedValue;
			}
			this.miss++;
			const value = utf8_1.utf8DecodeJs(bytes, inputOffset, byteLength);
			const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
			this.store(slicedCopyOfBytes, value);
			return value;
		}
	};
	exports.CachedKeyDecoder = CachedKeyDecoder;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/Decoder.js
var require_Decoder = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Decoder = exports.DataViewIndexOutOfBoundsError = void 0;
	var prettyByte_1 = require_prettyByte();
	var ExtensionCodec_1 = require_ExtensionCodec();
	var int_1 = require_int();
	var utf8_1 = require_utf8();
	var typedArrays_1 = require_typedArrays();
	var CachedKeyDecoder_1 = require_CachedKeyDecoder();
	var isValidMapKeyType = (key) => {
		const keyType = typeof key;
		return keyType === "string" || keyType === "number";
	};
	var HEAD_BYTE_REQUIRED = -1;
	var EMPTY_VIEW = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0));
	var EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
	exports.DataViewIndexOutOfBoundsError = (() => {
		try {
			EMPTY_VIEW.getInt8(0);
		} catch (e) {
			return e.constructor;
		}
		throw new Error("never reached");
	})();
	var MORE_DATA = new exports.DataViewIndexOutOfBoundsError("Insufficient data");
	var DEFAULT_MAX_LENGTH = 4294967295;
	var sharedCachedKeyDecoder = new CachedKeyDecoder_1.CachedKeyDecoder();
	var Decoder = class {
		constructor(extensionCodec = ExtensionCodec_1.ExtensionCodec.defaultCodec, context = void 0, maxStrLength = DEFAULT_MAX_LENGTH, maxBinLength = DEFAULT_MAX_LENGTH, maxArrayLength = DEFAULT_MAX_LENGTH, maxMapLength = DEFAULT_MAX_LENGTH, maxExtLength = DEFAULT_MAX_LENGTH, keyDecoder = sharedCachedKeyDecoder) {
			this.extensionCodec = extensionCodec;
			this.context = context;
			this.maxStrLength = maxStrLength;
			this.maxBinLength = maxBinLength;
			this.maxArrayLength = maxArrayLength;
			this.maxMapLength = maxMapLength;
			this.maxExtLength = maxExtLength;
			this.keyDecoder = keyDecoder;
			this.totalPos = 0;
			this.pos = 0;
			this.view = EMPTY_VIEW;
			this.bytes = EMPTY_BYTES;
			this.headByte = HEAD_BYTE_REQUIRED;
			this.stack = [];
		}
		reinitializeState() {
			this.totalPos = 0;
			this.headByte = HEAD_BYTE_REQUIRED;
		}
		setBuffer(buffer) {
			this.bytes = typedArrays_1.ensureUint8Array(buffer);
			this.view = typedArrays_1.createDataView(this.bytes);
			this.pos = 0;
		}
		appendBuffer(buffer) {
			if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining()) this.setBuffer(buffer);
			else {
				const remainingData = this.bytes.subarray(this.pos);
				const newData = typedArrays_1.ensureUint8Array(buffer);
				const concated = new Uint8Array(remainingData.length + newData.length);
				concated.set(remainingData);
				concated.set(newData, remainingData.length);
				this.setBuffer(concated);
			}
		}
		hasRemaining(size = 1) {
			return this.view.byteLength - this.pos >= size;
		}
		createNoExtraBytesError(posToShow) {
			const { view, pos } = this;
			return /* @__PURE__ */ new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
		}
		decode(buffer) {
			this.reinitializeState();
			this.setBuffer(buffer);
			return this.doDecodeSingleSync();
		}
		doDecodeSingleSync() {
			const object = this.doDecodeSync();
			if (this.hasRemaining()) throw this.createNoExtraBytesError(this.pos);
			return object;
		}
		async decodeAsync(stream) {
			let decoded = false;
			let object;
			for await (const buffer of stream) {
				if (decoded) throw this.createNoExtraBytesError(this.totalPos);
				this.appendBuffer(buffer);
				try {
					object = this.doDecodeSync();
					decoded = true;
				} catch (e) {
					if (!(e instanceof exports.DataViewIndexOutOfBoundsError)) throw e;
				}
				this.totalPos += this.pos;
			}
			if (decoded) {
				if (this.hasRemaining()) throw this.createNoExtraBytesError(this.totalPos);
				return object;
			}
			const { headByte, pos, totalPos } = this;
			throw new RangeError(`Insufficient data in parcing ${prettyByte_1.prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
		}
		decodeArrayStream(stream) {
			return this.decodeMultiAsync(stream, true);
		}
		decodeStream(stream) {
			return this.decodeMultiAsync(stream, false);
		}
		async *decodeMultiAsync(stream, isArray) {
			let isArrayHeaderRequired = isArray;
			let arrayItemsLeft = -1;
			for await (const buffer of stream) {
				if (isArray && arrayItemsLeft === 0) throw this.createNoExtraBytesError(this.totalPos);
				this.appendBuffer(buffer);
				if (isArrayHeaderRequired) {
					arrayItemsLeft = this.readArraySize();
					isArrayHeaderRequired = false;
					this.complete();
				}
				try {
					while (true) {
						yield this.doDecodeSync();
						if (--arrayItemsLeft === 0) break;
					}
				} catch (e) {
					if (!(e instanceof exports.DataViewIndexOutOfBoundsError)) throw e;
				}
				this.totalPos += this.pos;
			}
		}
		doDecodeSync() {
			DECODE: while (true) {
				const headByte = this.readHeadByte();
				let object;
				if (headByte >= 224) object = headByte - 256;
				else if (headByte < 192) {
					if (headByte < 128) object = headByte;
					else if (headByte < 144) {
						const size = headByte - 128;
						if (size !== 0) {
							this.pushMapState(size);
							this.complete();
							continue DECODE;
						} else object = {};
					} else if (headByte < 160) {
						const size = headByte - 144;
						if (size !== 0) {
							this.pushArrayState(size);
							this.complete();
							continue DECODE;
						} else object = [];
					} else {
						const byteLength = headByte - 160;
						object = this.decodeUtf8String(byteLength, 0);
					}
				} else if (headByte === 192) object = null;
				else if (headByte === 194) object = false;
				else if (headByte === 195) object = true;
				else if (headByte === 202) object = this.readF32();
				else if (headByte === 203) object = this.readF64();
				else if (headByte === 204) object = this.readU8();
				else if (headByte === 205) object = this.readU16();
				else if (headByte === 206) object = this.readU32();
				else if (headByte === 207) object = this.readU64();
				else if (headByte === 208) object = this.readI8();
				else if (headByte === 209) object = this.readI16();
				else if (headByte === 210) object = this.readI32();
				else if (headByte === 211) object = this.readI64();
				else if (headByte === 217) {
					const byteLength = this.lookU8();
					object = this.decodeUtf8String(byteLength, 1);
				} else if (headByte === 218) {
					const byteLength = this.lookU16();
					object = this.decodeUtf8String(byteLength, 2);
				} else if (headByte === 219) {
					const byteLength = this.lookU32();
					object = this.decodeUtf8String(byteLength, 4);
				} else if (headByte === 220) {
					const size = this.readU16();
					if (size !== 0) {
						this.pushArrayState(size);
						this.complete();
						continue DECODE;
					} else object = [];
				} else if (headByte === 221) {
					const size = this.readU32();
					if (size !== 0) {
						this.pushArrayState(size);
						this.complete();
						continue DECODE;
					} else object = [];
				} else if (headByte === 222) {
					const size = this.readU16();
					if (size !== 0) {
						this.pushMapState(size);
						this.complete();
						continue DECODE;
					} else object = {};
				} else if (headByte === 223) {
					const size = this.readU32();
					if (size !== 0) {
						this.pushMapState(size);
						this.complete();
						continue DECODE;
					} else object = {};
				} else if (headByte === 196) {
					const size = this.lookU8();
					object = this.decodeBinary(size, 1);
				} else if (headByte === 197) {
					const size = this.lookU16();
					object = this.decodeBinary(size, 2);
				} else if (headByte === 198) {
					const size = this.lookU32();
					object = this.decodeBinary(size, 4);
				} else if (headByte === 212) object = this.decodeExtension(1, 0);
				else if (headByte === 213) object = this.decodeExtension(2, 0);
				else if (headByte === 214) object = this.decodeExtension(4, 0);
				else if (headByte === 215) object = this.decodeExtension(8, 0);
				else if (headByte === 216) object = this.decodeExtension(16, 0);
				else if (headByte === 199) {
					const size = this.lookU8();
					object = this.decodeExtension(size, 1);
				} else if (headByte === 200) {
					const size = this.lookU16();
					object = this.decodeExtension(size, 2);
				} else if (headByte === 201) {
					const size = this.lookU32();
					object = this.decodeExtension(size, 4);
				} else throw new Error(`Unrecognized type byte: ${prettyByte_1.prettyByte(headByte)}`);
				this.complete();
				const stack = this.stack;
				while (stack.length > 0) {
					const state = stack[stack.length - 1];
					if (state.type === 0) {
						state.array[state.position] = object;
						state.position++;
						if (state.position === state.size) {
							stack.pop();
							object = state.array;
						} else continue DECODE;
					} else if (state.type === 1) {
						if (!isValidMapKeyType(object)) throw new Error("The type of key must be string or number but " + typeof object);
						state.key = object;
						state.type = 2;
						continue DECODE;
					} else {
						state.map[state.key] = object;
						state.readCount++;
						if (state.readCount === state.size) {
							stack.pop();
							object = state.map;
						} else {
							state.key = null;
							state.type = 1;
							continue DECODE;
						}
					}
				}
				return object;
			}
		}
		readHeadByte() {
			if (this.headByte === HEAD_BYTE_REQUIRED) this.headByte = this.readU8();
			return this.headByte;
		}
		complete() {
			this.headByte = HEAD_BYTE_REQUIRED;
		}
		readArraySize() {
			const headByte = this.readHeadByte();
			switch (headByte) {
				case 220: return this.readU16();
				case 221: return this.readU32();
				default: if (headByte < 160) return headByte - 144;
				else throw new Error(`Unrecognized array type byte: ${prettyByte_1.prettyByte(headByte)}`);
			}
		}
		pushMapState(size) {
			if (size > this.maxMapLength) throw new Error(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
			this.stack.push({
				type: 1,
				size,
				key: null,
				readCount: 0,
				map: {}
			});
		}
		pushArrayState(size) {
			if (size > this.maxArrayLength) throw new Error(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
			this.stack.push({
				type: 0,
				size,
				array: new Array(size),
				position: 0
			});
		}
		decodeUtf8String(byteLength, headerOffset) {
			var _a;
			if (byteLength > this.maxStrLength) throw new Error(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
			if (this.bytes.byteLength < this.pos + headerOffset + byteLength) throw MORE_DATA;
			const offset = this.pos + headerOffset;
			let object;
			if (this.stateIsMapKey() && ((_a = this.keyDecoder) === null || _a === void 0 ? void 0 : _a.canBeCached(byteLength))) object = this.keyDecoder.decode(this.bytes, offset, byteLength);
			else if (utf8_1.TEXT_ENCODING_AVAILABLE && byteLength > utf8_1.TEXT_DECODER_THRESHOLD) object = utf8_1.utf8DecodeTD(this.bytes, offset, byteLength);
			else object = utf8_1.utf8DecodeJs(this.bytes, offset, byteLength);
			this.pos += headerOffset + byteLength;
			return object;
		}
		stateIsMapKey() {
			if (this.stack.length > 0) return this.stack[this.stack.length - 1].type === 1;
			return false;
		}
		decodeBinary(byteLength, headOffset) {
			if (byteLength > this.maxBinLength) throw new Error(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
			if (!this.hasRemaining(byteLength + headOffset)) throw MORE_DATA;
			const offset = this.pos + headOffset;
			const object = this.bytes.subarray(offset, offset + byteLength);
			this.pos += headOffset + byteLength;
			return object;
		}
		decodeExtension(size, headOffset) {
			if (size > this.maxExtLength) throw new Error(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
			const extType = this.view.getInt8(this.pos + headOffset);
			const data = this.decodeBinary(size, headOffset + 1);
			return this.extensionCodec.decode(data, extType, this.context);
		}
		lookU8() {
			return this.view.getUint8(this.pos);
		}
		lookU16() {
			return this.view.getUint16(this.pos);
		}
		lookU32() {
			return this.view.getUint32(this.pos);
		}
		readU8() {
			const value = this.view.getUint8(this.pos);
			this.pos++;
			return value;
		}
		readI8() {
			const value = this.view.getInt8(this.pos);
			this.pos++;
			return value;
		}
		readU16() {
			const value = this.view.getUint16(this.pos);
			this.pos += 2;
			return value;
		}
		readI16() {
			const value = this.view.getInt16(this.pos);
			this.pos += 2;
			return value;
		}
		readU32() {
			const value = this.view.getUint32(this.pos);
			this.pos += 4;
			return value;
		}
		readI32() {
			const value = this.view.getInt32(this.pos);
			this.pos += 4;
			return value;
		}
		readU64() {
			const value = int_1.getUint64(this.view, this.pos);
			this.pos += 8;
			return value;
		}
		readI64() {
			const value = int_1.getInt64(this.view, this.pos);
			this.pos += 8;
			return value;
		}
		readF32() {
			const value = this.view.getFloat32(this.pos);
			this.pos += 4;
			return value;
		}
		readF64() {
			const value = this.view.getFloat64(this.pos);
			this.pos += 8;
			return value;
		}
	};
	exports.Decoder = Decoder;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/decode.js
var require_decode = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decode = exports.defaultDecodeOptions = void 0;
	var Decoder_1 = require_Decoder();
	exports.defaultDecodeOptions = {};
	/**
	* It decodes a MessagePack-encoded buffer.
	*
	* This is a synchronous decoding function. See other variants for asynchronous decoding: `decodeAsync()`, `decodeStream()`, `decodeArrayStream()`.
	*/
	function decode(buffer, options = exports.defaultDecodeOptions) {
		return new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength).decode(buffer);
	}
	exports.decode = decode;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/utils/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ensureAsyncIterabe = exports.asyncIterableFromStream = exports.isAsyncIterable = void 0;
	function isAsyncIterable(object) {
		return object[Symbol.asyncIterator] != null;
	}
	exports.isAsyncIterable = isAsyncIterable;
	function assertNonNull(value) {
		if (value == null) throw new Error("Assertion Failure: value must not be null nor undefined");
	}
	async function* asyncIterableFromStream(stream) {
		const reader = stream.getReader();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) return;
				assertNonNull(value);
				yield value;
			}
		} finally {
			reader.releaseLock();
		}
	}
	exports.asyncIterableFromStream = asyncIterableFromStream;
	function ensureAsyncIterabe(streamLike) {
		if (isAsyncIterable(streamLike)) return streamLike;
		else return asyncIterableFromStream(streamLike);
	}
	exports.ensureAsyncIterabe = ensureAsyncIterabe;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/decodeAsync.js
var require_decodeAsync = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decodeStream = exports.decodeArrayStream = exports.decodeAsync = void 0;
	var Decoder_1 = require_Decoder();
	var decode_1 = require_decode();
	var stream_1 = require_stream();
	async function decodeAsync(streamLike, options = decode_1.defaultDecodeOptions) {
		const stream = stream_1.ensureAsyncIterabe(streamLike);
		return new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength).decodeAsync(stream);
	}
	exports.decodeAsync = decodeAsync;
	function decodeArrayStream(streamLike, options = decode_1.defaultDecodeOptions) {
		const stream = stream_1.ensureAsyncIterabe(streamLike);
		return new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength).decodeArrayStream(stream);
	}
	exports.decodeArrayStream = decodeArrayStream;
	function decodeStream(streamLike, options = decode_1.defaultDecodeOptions) {
		const stream = stream_1.ensureAsyncIterabe(streamLike);
		return new Decoder_1.Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength).decodeStream(stream);
	}
	exports.decodeStream = decodeStream;
}));
//#endregion
//#region node_modules/algo-msgpack-with-bigint/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.decodeTimestampExtension = exports.encodeTimestampExtension = exports.decodeTimestampToTimeSpec = exports.encodeTimeSpecToTimestamp = exports.encodeDateToTimeSpec = exports.EXT_TIMESTAMP = exports.ExtData = exports.ExtensionCodec = exports.Encoder = exports.Decoder = exports.decodeStream = exports.decodeArrayStream = exports.decodeAsync = exports.decode = exports.encode = void 0;
	var encode_1 = require_encode();
	Object.defineProperty(exports, "encode", {
		enumerable: true,
		get: function() {
			return encode_1.encode;
		}
	});
	var decode_1 = require_decode();
	Object.defineProperty(exports, "decode", {
		enumerable: true,
		get: function() {
			return decode_1.decode;
		}
	});
	var decodeAsync_1 = require_decodeAsync();
	Object.defineProperty(exports, "decodeAsync", {
		enumerable: true,
		get: function() {
			return decodeAsync_1.decodeAsync;
		}
	});
	Object.defineProperty(exports, "decodeArrayStream", {
		enumerable: true,
		get: function() {
			return decodeAsync_1.decodeArrayStream;
		}
	});
	Object.defineProperty(exports, "decodeStream", {
		enumerable: true,
		get: function() {
			return decodeAsync_1.decodeStream;
		}
	});
	/**
	* @experimental `Decoder` is exported for experimental use.
	*/
	var Decoder_1 = require_Decoder();
	Object.defineProperty(exports, "Decoder", {
		enumerable: true,
		get: function() {
			return Decoder_1.Decoder;
		}
	});
	/**
	* @experimental `Encoder` is exported for experimental use.
	*/
	var Encoder_1 = require_Encoder();
	Object.defineProperty(exports, "Encoder", {
		enumerable: true,
		get: function() {
			return Encoder_1.Encoder;
		}
	});
	var ExtensionCodec_1 = require_ExtensionCodec();
	Object.defineProperty(exports, "ExtensionCodec", {
		enumerable: true,
		get: function() {
			return ExtensionCodec_1.ExtensionCodec;
		}
	});
	var ExtData_1 = require_ExtData();
	Object.defineProperty(exports, "ExtData", {
		enumerable: true,
		get: function() {
			return ExtData_1.ExtData;
		}
	});
	var timestamp_1 = require_timestamp();
	Object.defineProperty(exports, "EXT_TIMESTAMP", {
		enumerable: true,
		get: function() {
			return timestamp_1.EXT_TIMESTAMP;
		}
	});
	Object.defineProperty(exports, "encodeDateToTimeSpec", {
		enumerable: true,
		get: function() {
			return timestamp_1.encodeDateToTimeSpec;
		}
	});
	Object.defineProperty(exports, "encodeTimeSpecToTimestamp", {
		enumerable: true,
		get: function() {
			return timestamp_1.encodeTimeSpecToTimestamp;
		}
	});
	Object.defineProperty(exports, "decodeTimestampToTimeSpec", {
		enumerable: true,
		get: function() {
			return timestamp_1.decodeTimestampToTimeSpec;
		}
	});
	Object.defineProperty(exports, "encodeTimestampExtension", {
		enumerable: true,
		get: function() {
			return timestamp_1.encodeTimestampExtension;
		}
	});
	Object.defineProperty(exports, "decodeTimestampExtension", {
		enumerable: true,
		get: function() {
			return timestamp_1.decodeTimestampExtension;
		}
	});
}));
//#endregion
//#region node_modules/ajv/dist/compile/codegen/code.js
var require_code$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
	var _CodeOrName = class {};
	exports._CodeOrName = _CodeOrName;
	exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
	var Name = class extends _CodeOrName {
		constructor(s) {
			super();
			if (!exports.IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier");
			this.str = s;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			return false;
		}
		get names() {
			return { [this.str]: 1 };
		}
	};
	exports.Name = Name;
	var _Code = class extends _CodeOrName {
		constructor(code) {
			super();
			this._items = typeof code === "string" ? [code] : code;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			if (this._items.length > 1) return false;
			const item = this._items[0];
			return item === "" || item === "\"\"";
		}
		get str() {
			var _a;
			return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
		}
		get names() {
			var _a;
			return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
				if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1;
				return names;
			}, {});
		}
	};
	exports._Code = _Code;
	exports.nil = new _Code("");
	function _(strs, ...args) {
		const code = [strs[0]];
		let i = 0;
		while (i < args.length) {
			addCodeArg(code, args[i]);
			code.push(strs[++i]);
		}
		return new _Code(code);
	}
	exports._ = _;
	var plus = new _Code("+");
	function str(strs, ...args) {
		const expr = [safeStringify(strs[0])];
		let i = 0;
		while (i < args.length) {
			expr.push(plus);
			addCodeArg(expr, args[i]);
			expr.push(plus, safeStringify(strs[++i]));
		}
		optimize(expr);
		return new _Code(expr);
	}
	exports.str = str;
	function addCodeArg(code, arg) {
		if (arg instanceof _Code) code.push(...arg._items);
		else if (arg instanceof Name) code.push(arg);
		else code.push(interpolate(arg));
	}
	exports.addCodeArg = addCodeArg;
	function optimize(expr) {
		let i = 1;
		while (i < expr.length - 1) {
			if (expr[i] === plus) {
				const res = mergeExprItems(expr[i - 1], expr[i + 1]);
				if (res !== void 0) {
					expr.splice(i - 1, 3, res);
					continue;
				}
				expr[i++] = "+";
			}
			i++;
		}
	}
	function mergeExprItems(a, b) {
		if (b === "\"\"") return a;
		if (a === "\"\"") return b;
		if (typeof a == "string") {
			if (b instanceof Name || a[a.length - 1] !== "\"") return;
			if (typeof b != "string") return `${a.slice(0, -1)}${b}"`;
			if (b[0] === "\"") return a.slice(0, -1) + b.slice(1);
			return;
		}
		if (typeof b == "string" && b[0] === "\"" && !(a instanceof Name)) return `"${a}${b.slice(1)}`;
	}
	function strConcat(c1, c2) {
		return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
	}
	exports.strConcat = strConcat;
	function interpolate(x) {
		return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
	}
	function stringify(x) {
		return new _Code(safeStringify(x));
	}
	exports.stringify = stringify;
	function safeStringify(x) {
		return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	}
	exports.safeStringify = safeStringify;
	function getProperty(key) {
		return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
	}
	exports.getProperty = getProperty;
	function getEsmExportName(key) {
		if (typeof key == "string" && exports.IDENTIFIER.test(key)) return new _Code(`${key}`);
		throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
	}
	exports.getEsmExportName = getEsmExportName;
	function regexpCode(rx) {
		return new _Code(rx.toString());
	}
	exports.regexpCode = regexpCode;
}));
//#endregion
//#region node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
	var code_1 = require_code$1();
	var ValueError = class extends Error {
		constructor(name) {
			super(`CodeGen: "code" for ${name} not defined`);
			this.value = name.value;
		}
	};
	var UsedValueState;
	(function(UsedValueState) {
		UsedValueState[UsedValueState["Started"] = 0] = "Started";
		UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
	})(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
	exports.varKinds = {
		const: new code_1.Name("const"),
		let: new code_1.Name("let"),
		var: new code_1.Name("var")
	};
	var Scope = class {
		constructor({ prefixes, parent } = {}) {
			this._names = {};
			this._prefixes = prefixes;
			this._parent = parent;
		}
		toName(nameOrPrefix) {
			return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
		}
		name(prefix) {
			return new code_1.Name(this._newName(prefix));
		}
		_newName(prefix) {
			const ng = this._names[prefix] || this._nameGroup(prefix);
			return `${prefix}${ng.index++}`;
		}
		_nameGroup(prefix) {
			var _a, _b;
			if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
			return this._names[prefix] = {
				prefix,
				index: 0
			};
		}
	};
	exports.Scope = Scope;
	var ValueScopeName = class extends code_1.Name {
		constructor(prefix, nameStr) {
			super(nameStr);
			this.prefix = prefix;
		}
		setValue(value, { property, itemIndex }) {
			this.value = value;
			this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
		}
	};
	exports.ValueScopeName = ValueScopeName;
	var line = (0, code_1._)`\n`;
	var ValueScope = class extends Scope {
		constructor(opts) {
			super(opts);
			this._values = {};
			this._scope = opts.scope;
			this.opts = {
				...opts,
				_n: opts.lines ? line : code_1.nil
			};
		}
		get() {
			return this._scope;
		}
		name(prefix) {
			return new ValueScopeName(prefix, this._newName(prefix));
		}
		value(nameOrPrefix, value) {
			var _a;
			if (value.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
			const name = this.toName(nameOrPrefix);
			const { prefix } = name;
			const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
			let vs = this._values[prefix];
			if (vs) {
				const _name = vs.get(valueKey);
				if (_name) return _name;
			} else vs = this._values[prefix] = /* @__PURE__ */ new Map();
			vs.set(valueKey, name);
			const s = this._scope[prefix] || (this._scope[prefix] = []);
			const itemIndex = s.length;
			s[itemIndex] = value.ref;
			name.setValue(value, {
				property: prefix,
				itemIndex
			});
			return name;
		}
		getValue(prefix, keyOrRef) {
			const vs = this._values[prefix];
			if (!vs) return;
			return vs.get(keyOrRef);
		}
		scopeRefs(scopeName, values = this._values) {
			return this._reduceValues(values, (name) => {
				if (name.scopePath === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return (0, code_1._)`${scopeName}${name.scopePath}`;
			});
		}
		scopeCode(values = this._values, usedValues, getCode) {
			return this._reduceValues(values, (name) => {
				if (name.value === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return name.value.code;
			}, usedValues, getCode);
		}
		_reduceValues(values, valueCode, usedValues = {}, getCode) {
			let code = code_1.nil;
			for (const prefix in values) {
				const vs = values[prefix];
				if (!vs) continue;
				const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
				vs.forEach((name) => {
					if (nameSet.has(name)) return;
					nameSet.set(name, UsedValueState.Started);
					let c = valueCode(name);
					if (c) {
						const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
						code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
					} else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) code = (0, code_1._)`${code}${c}${this.opts._n}`;
					else throw new ValueError(name);
					nameSet.set(name, UsedValueState.Completed);
				});
			}
			return code;
		}
	};
	exports.ValueScope = ValueScope;
}));
//#endregion
//#region node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
	var code_1 = require_code$1();
	var scope_1 = require_scope();
	var code_2 = require_code$1();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return code_2._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return code_2.str;
		}
	});
	Object.defineProperty(exports, "strConcat", {
		enumerable: true,
		get: function() {
			return code_2.strConcat;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return code_2.nil;
		}
	});
	Object.defineProperty(exports, "getProperty", {
		enumerable: true,
		get: function() {
			return code_2.getProperty;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return code_2.stringify;
		}
	});
	Object.defineProperty(exports, "regexpCode", {
		enumerable: true,
		get: function() {
			return code_2.regexpCode;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return code_2.Name;
		}
	});
	var scope_2 = require_scope();
	Object.defineProperty(exports, "Scope", {
		enumerable: true,
		get: function() {
			return scope_2.Scope;
		}
	});
	Object.defineProperty(exports, "ValueScope", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScope;
		}
	});
	Object.defineProperty(exports, "ValueScopeName", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScopeName;
		}
	});
	Object.defineProperty(exports, "varKinds", {
		enumerable: true,
		get: function() {
			return scope_2.varKinds;
		}
	});
	exports.operators = {
		GT: new code_1._Code(">"),
		GTE: new code_1._Code(">="),
		LT: new code_1._Code("<"),
		LTE: new code_1._Code("<="),
		EQ: new code_1._Code("==="),
		NEQ: new code_1._Code("!=="),
		NOT: new code_1._Code("!"),
		OR: new code_1._Code("||"),
		AND: new code_1._Code("&&"),
		ADD: new code_1._Code("+")
	};
	var Node = class {
		optimizeNodes() {
			return this;
		}
		optimizeNames(_names, _constants) {
			return this;
		}
	};
	var Def = class extends Node {
		constructor(varKind, name, rhs) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.rhs = rhs;
		}
		render({ es5, _n }) {
			const varKind = es5 ? scope_1.varKinds.var : this.varKind;
			const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
			return `${varKind} ${this.name}${rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (!names[this.name.str]) return;
			if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
		}
	};
	var Assign = class extends Node {
		constructor(lhs, rhs, sideEffects) {
			super();
			this.lhs = lhs;
			this.rhs = rhs;
			this.sideEffects = sideEffects;
		}
		render({ _n }) {
			return `${this.lhs} = ${this.rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects) return;
			this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return addExprNames(this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names }, this.rhs);
		}
	};
	var AssignOp = class extends Assign {
		constructor(lhs, op, rhs, sideEffects) {
			super(lhs, rhs, sideEffects);
			this.op = op;
		}
		render({ _n }) {
			return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
		}
	};
	var Label = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `${this.label}:` + _n;
		}
	};
	var Break = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `break${this.label ? ` ${this.label}` : ""};` + _n;
		}
	};
	var Throw = class extends Node {
		constructor(error) {
			super();
			this.error = error;
		}
		render({ _n }) {
			return `throw ${this.error};` + _n;
		}
		get names() {
			return this.error.names;
		}
	};
	var AnyCode = class extends Node {
		constructor(code) {
			super();
			this.code = code;
		}
		render({ _n }) {
			return `${this.code};` + _n;
		}
		optimizeNodes() {
			return `${this.code}` ? this : void 0;
		}
		optimizeNames(names, constants) {
			this.code = optimizeExpr(this.code, names, constants);
			return this;
		}
		get names() {
			return this.code instanceof code_1._CodeOrName ? this.code.names : {};
		}
	};
	var ParentNode = class extends Node {
		constructor(nodes = []) {
			super();
			this.nodes = nodes;
		}
		render(opts) {
			return this.nodes.reduce((code, n) => code + n.render(opts), "");
		}
		optimizeNodes() {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i].optimizeNodes();
				if (Array.isArray(n)) nodes.splice(i, 1, ...n);
				else if (n) nodes[i] = n;
				else nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		optimizeNames(names, constants) {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i];
				if (n.optimizeNames(names, constants)) continue;
				subtractNames(names, n.names);
				nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		get names() {
			return this.nodes.reduce((names, n) => addNames(names, n.names), {});
		}
	};
	var BlockNode = class extends ParentNode {
		render(opts) {
			return "{" + opts._n + super.render(opts) + "}" + opts._n;
		}
	};
	var Root = class extends ParentNode {};
	var Else = class extends BlockNode {};
	Else.kind = "else";
	var If = class If extends BlockNode {
		constructor(condition, nodes) {
			super(nodes);
			this.condition = condition;
		}
		render(opts) {
			let code = `if(${this.condition})` + super.render(opts);
			if (this.else) code += "else " + this.else.render(opts);
			return code;
		}
		optimizeNodes() {
			super.optimizeNodes();
			const cond = this.condition;
			if (cond === true) return this.nodes;
			let e = this.else;
			if (e) {
				const ns = e.optimizeNodes();
				e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
			}
			if (e) {
				if (cond === false) return e instanceof If ? e : e.nodes;
				if (this.nodes.length) return this;
				return new If(not(cond), e instanceof If ? [e] : e.nodes);
			}
			if (cond === false || !this.nodes.length) return void 0;
			return this;
		}
		optimizeNames(names, constants) {
			var _a;
			this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
			if (!(super.optimizeNames(names, constants) || this.else)) return;
			this.condition = optimizeExpr(this.condition, names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			addExprNames(names, this.condition);
			if (this.else) addNames(names, this.else.names);
			return names;
		}
	};
	If.kind = "if";
	var For = class extends BlockNode {};
	For.kind = "for";
	var ForLoop = class extends For {
		constructor(iteration) {
			super();
			this.iteration = iteration;
		}
		render(opts) {
			return `for(${this.iteration})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iteration = optimizeExpr(this.iteration, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iteration.names);
		}
	};
	var ForRange = class extends For {
		constructor(varKind, name, from, to) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.from = from;
			this.to = to;
		}
		render(opts) {
			const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
			const { name, from, to } = this;
			return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
		}
		get names() {
			return addExprNames(addExprNames(super.names, this.from), this.to);
		}
	};
	var ForIter = class extends For {
		constructor(loop, varKind, name, iterable) {
			super();
			this.loop = loop;
			this.varKind = varKind;
			this.name = name;
			this.iterable = iterable;
		}
		render(opts) {
			return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iterable = optimizeExpr(this.iterable, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iterable.names);
		}
	};
	var Func = class extends BlockNode {
		constructor(name, args, async) {
			super();
			this.name = name;
			this.args = args;
			this.async = async;
		}
		render(opts) {
			return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(opts);
		}
	};
	Func.kind = "func";
	var Return = class extends ParentNode {
		render(opts) {
			return "return " + super.render(opts);
		}
	};
	Return.kind = "return";
	var Try = class extends BlockNode {
		render(opts) {
			let code = "try" + super.render(opts);
			if (this.catch) code += this.catch.render(opts);
			if (this.finally) code += this.finally.render(opts);
			return code;
		}
		optimizeNodes() {
			var _a, _b;
			super.optimizeNodes();
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNodes();
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNodes();
			return this;
		}
		optimizeNames(names, constants) {
			var _a, _b;
			super.optimizeNames(names, constants);
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNames(names, constants);
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNames(names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			if (this.catch) addNames(names, this.catch.names);
			if (this.finally) addNames(names, this.finally.names);
			return names;
		}
	};
	var Catch = class extends BlockNode {
		constructor(error) {
			super();
			this.error = error;
		}
		render(opts) {
			return `catch(${this.error})` + super.render(opts);
		}
	};
	Catch.kind = "catch";
	var Finally = class extends BlockNode {
		render(opts) {
			return "finally" + super.render(opts);
		}
	};
	Finally.kind = "finally";
	var CodeGen = class {
		constructor(extScope, opts = {}) {
			this._values = {};
			this._blockStarts = [];
			this._constants = {};
			this.opts = {
				...opts,
				_n: opts.lines ? "\n" : ""
			};
			this._extScope = extScope;
			this._scope = new scope_1.Scope({ parent: extScope });
			this._nodes = [new Root()];
		}
		toString() {
			return this._root.render(this.opts);
		}
		name(prefix) {
			return this._scope.name(prefix);
		}
		scopeName(prefix) {
			return this._extScope.name(prefix);
		}
		scopeValue(prefixOrName, value) {
			const name = this._extScope.value(prefixOrName, value);
			(this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set())).add(name);
			return name;
		}
		getScopeValue(prefix, keyOrRef) {
			return this._extScope.getValue(prefix, keyOrRef);
		}
		scopeRefs(scopeName) {
			return this._extScope.scopeRefs(scopeName, this._values);
		}
		scopeCode() {
			return this._extScope.scopeCode(this._values);
		}
		_def(varKind, nameOrPrefix, rhs, constant) {
			const name = this._scope.toName(nameOrPrefix);
			if (rhs !== void 0 && constant) this._constants[name.str] = rhs;
			this._leafNode(new Def(varKind, name, rhs));
			return name;
		}
		const(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
		}
		let(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
		}
		var(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
		}
		assign(lhs, rhs, sideEffects) {
			return this._leafNode(new Assign(lhs, rhs, sideEffects));
		}
		add(lhs, rhs) {
			return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
		}
		code(c) {
			if (typeof c == "function") c();
			else if (c !== code_1.nil) this._leafNode(new AnyCode(c));
			return this;
		}
		object(...keyValues) {
			const code = ["{"];
			for (const [key, value] of keyValues) {
				if (code.length > 1) code.push(",");
				code.push(key);
				if (key !== value || this.opts.es5) {
					code.push(":");
					(0, code_1.addCodeArg)(code, value);
				}
			}
			code.push("}");
			return new code_1._Code(code);
		}
		if(condition, thenBody, elseBody) {
			this._blockNode(new If(condition));
			if (thenBody && elseBody) this.code(thenBody).else().code(elseBody).endIf();
			else if (thenBody) this.code(thenBody).endIf();
			else if (elseBody) throw new Error("CodeGen: \"else\" body without \"then\" body");
			return this;
		}
		elseIf(condition) {
			return this._elseNode(new If(condition));
		}
		else() {
			return this._elseNode(new Else());
		}
		endIf() {
			return this._endBlockNode(If, Else);
		}
		_for(node, forBody) {
			this._blockNode(node);
			if (forBody) this.code(forBody).endFor();
			return this;
		}
		for(iteration, forBody) {
			return this._for(new ForLoop(iteration), forBody);
		}
		forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
		}
		forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
			const name = this._scope.toName(nameOrPrefix);
			if (this.opts.es5) {
				const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
				return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
					this.var(name, (0, code_1._)`${arr}[${i}]`);
					forBody(name);
				});
			}
			return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
		}
		forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
			if (this.opts.ownProperties) return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
		}
		endFor() {
			return this._endBlockNode(For);
		}
		label(label) {
			return this._leafNode(new Label(label));
		}
		break(label) {
			return this._leafNode(new Break(label));
		}
		return(value) {
			const node = new Return();
			this._blockNode(node);
			this.code(value);
			if (node.nodes.length !== 1) throw new Error("CodeGen: \"return\" should have one node");
			return this._endBlockNode(Return);
		}
		try(tryBody, catchCode, finallyCode) {
			if (!catchCode && !finallyCode) throw new Error("CodeGen: \"try\" without \"catch\" and \"finally\"");
			const node = new Try();
			this._blockNode(node);
			this.code(tryBody);
			if (catchCode) {
				const error = this.name("e");
				this._currNode = node.catch = new Catch(error);
				catchCode(error);
			}
			if (finallyCode) {
				this._currNode = node.finally = new Finally();
				this.code(finallyCode);
			}
			return this._endBlockNode(Catch, Finally);
		}
		throw(error) {
			return this._leafNode(new Throw(error));
		}
		block(body, nodeCount) {
			this._blockStarts.push(this._nodes.length);
			if (body) this.code(body).endBlock(nodeCount);
			return this;
		}
		endBlock(nodeCount) {
			const len = this._blockStarts.pop();
			if (len === void 0) throw new Error("CodeGen: not in self-balancing block");
			const toClose = this._nodes.length - len;
			if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
			this._nodes.length = len;
			return this;
		}
		func(name, args = code_1.nil, async, funcBody) {
			this._blockNode(new Func(name, args, async));
			if (funcBody) this.code(funcBody).endFunc();
			return this;
		}
		endFunc() {
			return this._endBlockNode(Func);
		}
		optimize(n = 1) {
			while (n-- > 0) {
				this._root.optimizeNodes();
				this._root.optimizeNames(this._root.names, this._constants);
			}
		}
		_leafNode(node) {
			this._currNode.nodes.push(node);
			return this;
		}
		_blockNode(node) {
			this._currNode.nodes.push(node);
			this._nodes.push(node);
		}
		_endBlockNode(N1, N2) {
			const n = this._currNode;
			if (n instanceof N1 || N2 && n instanceof N2) {
				this._nodes.pop();
				return this;
			}
			throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
		}
		_elseNode(node) {
			const n = this._currNode;
			if (!(n instanceof If)) throw new Error("CodeGen: \"else\" without \"if\"");
			this._currNode = n.else = node;
			return this;
		}
		get _root() {
			return this._nodes[0];
		}
		get _currNode() {
			const ns = this._nodes;
			return ns[ns.length - 1];
		}
		set _currNode(node) {
			const ns = this._nodes;
			ns[ns.length - 1] = node;
		}
	};
	exports.CodeGen = CodeGen;
	function addNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) + (from[n] || 0);
		return names;
	}
	function addExprNames(names, from) {
		return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
	}
	function optimizeExpr(expr, names, constants) {
		if (expr instanceof code_1.Name) return replaceName(expr);
		if (!canOptimize(expr)) return expr;
		return new code_1._Code(expr._items.reduce((items, c) => {
			if (c instanceof code_1.Name) c = replaceName(c);
			if (c instanceof code_1._Code) items.push(...c._items);
			else items.push(c);
			return items;
		}, []));
		function replaceName(n) {
			const c = constants[n.str];
			if (c === void 0 || names[n.str] !== 1) return n;
			delete names[n.str];
			return c;
		}
		function canOptimize(e) {
			return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
		}
	}
	function subtractNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) - (from[n] || 0);
	}
	function not(x) {
		return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
	}
	exports.not = not;
	var andCode = mappend(exports.operators.AND);
	function and(...args) {
		return args.reduce(andCode);
	}
	exports.and = and;
	var orCode = mappend(exports.operators.OR);
	function or(...args) {
		return args.reduce(orCode);
	}
	exports.or = or;
	function mappend(op) {
		return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
	}
	function par(x) {
		return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
	var codegen_1 = require_codegen();
	var code_1 = require_code$1();
	function toHash(arr) {
		const hash = {};
		for (const item of arr) hash[item] = true;
		return hash;
	}
	exports.toHash = toHash;
	function alwaysValidSchema(it, schema) {
		if (typeof schema == "boolean") return schema;
		if (Object.keys(schema).length === 0) return true;
		checkUnknownRules(it, schema);
		return !schemaHasRules(schema, it.self.RULES.all);
	}
	exports.alwaysValidSchema = alwaysValidSchema;
	function checkUnknownRules(it, schema = it.schema) {
		const { opts, self } = it;
		if (!opts.strictSchema) return;
		if (typeof schema === "boolean") return;
		const rules = self.RULES.keywords;
		for (const key in schema) if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`);
	}
	exports.checkUnknownRules = checkUnknownRules;
	function schemaHasRules(schema, rules) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (rules[key]) return true;
		return false;
	}
	exports.schemaHasRules = schemaHasRules;
	function schemaHasRulesButRef(schema, RULES) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (key !== "$ref" && RULES.all[key]) return true;
		return false;
	}
	exports.schemaHasRulesButRef = schemaHasRulesButRef;
	function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
		if (!$data) {
			if (typeof schema == "number" || typeof schema == "boolean") return schema;
			if (typeof schema == "string") return (0, codegen_1._)`${schema}`;
		}
		return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
	}
	exports.schemaRefOrVal = schemaRefOrVal;
	function unescapeFragment(str) {
		return unescapeJsonPointer(decodeURIComponent(str));
	}
	exports.unescapeFragment = unescapeFragment;
	function escapeFragment(str) {
		return encodeURIComponent(escapeJsonPointer(str));
	}
	exports.escapeFragment = escapeFragment;
	function escapeJsonPointer(str) {
		if (typeof str == "number") return `${str}`;
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	exports.escapeJsonPointer = escapeJsonPointer;
	function unescapeJsonPointer(str) {
		return str.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	exports.unescapeJsonPointer = unescapeJsonPointer;
	function eachItem(xs, f) {
		if (Array.isArray(xs)) for (const x of xs) f(x);
		else f(xs);
	}
	exports.eachItem = eachItem;
	function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
		return (gen, from, to, toName) => {
			const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
			return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
		};
	}
	exports.mergeEvaluated = {
		props: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
				gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
			}),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
				if (from === true) gen.assign(to, true);
				else {
					gen.assign(to, (0, codegen_1._)`${to} || {}`);
					setEvaluated(gen, to, from);
				}
			}),
			mergeValues: (from, to) => from === true ? true : {
				...from,
				...to
			},
			resultToName: evaluatedPropsToName
		}),
		items: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
			mergeValues: (from, to) => from === true ? true : Math.max(from, to),
			resultToName: (gen, items) => gen.var("items", items)
		})
	};
	function evaluatedPropsToName(gen, ps) {
		if (ps === true) return gen.var("props", true);
		const props = gen.var("props", (0, codegen_1._)`{}`);
		if (ps !== void 0) setEvaluated(gen, props, ps);
		return props;
	}
	exports.evaluatedPropsToName = evaluatedPropsToName;
	function setEvaluated(gen, props, ps) {
		Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
	}
	exports.setEvaluated = setEvaluated;
	var snippets = {};
	function useFunc(gen, f) {
		return gen.scopeValue("func", {
			ref: f,
			code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
		});
	}
	exports.useFunc = useFunc;
	var Type;
	(function(Type) {
		Type[Type["Num"] = 0] = "Num";
		Type[Type["Str"] = 1] = "Str";
	})(Type || (exports.Type = Type = {}));
	function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
		if (dataProp instanceof codegen_1.Name) {
			const isNumber = dataPropType === Type.Num;
			return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
		}
		return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
	}
	exports.getErrorPath = getErrorPath;
	function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
		if (!mode) return;
		msg = `strict mode: ${msg}`;
		if (mode === true) throw new Error(msg);
		it.self.logger.warn(msg);
	}
	exports.checkStrictMode = checkStrictMode;
}));
//#endregion
//#region node_modules/ajv/dist/compile/names.js
var require_names = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		data: new codegen_1.Name("data"),
		valCxt: new codegen_1.Name("valCxt"),
		instancePath: new codegen_1.Name("instancePath"),
		parentData: new codegen_1.Name("parentData"),
		parentDataProperty: new codegen_1.Name("parentDataProperty"),
		rootData: new codegen_1.Name("rootData"),
		dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
		vErrors: new codegen_1.Name("vErrors"),
		errors: new codegen_1.Name("errors"),
		this: new codegen_1.Name("this"),
		self: new codegen_1.Name("self"),
		scope: new codegen_1.Name("scope"),
		json: new codegen_1.Name("json"),
		jsonPos: new codegen_1.Name("jsonPos"),
		jsonLen: new codegen_1.Name("jsonLen"),
		jsonPart: new codegen_1.Name("jsonPart")
	};
}));
//#endregion
//#region node_modules/ajv/dist/compile/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	exports.keywordError = { message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation` };
	exports.keyword$DataError = { message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)` };
	function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		const errObj = errorObjectCode(cxt, error, errorPaths);
		if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) addError(gen, errObj);
		else returnErrors(it, (0, codegen_1._)`[${errObj}]`);
	}
	exports.reportError = reportError;
	function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		addError(gen, errorObjectCode(cxt, error, errorPaths));
		if (!(compositeRule || allErrors)) returnErrors(it, names_1.default.vErrors);
	}
	exports.reportExtraError = reportExtraError;
	function resetErrorsCount(gen, errsCount) {
		gen.assign(names_1.default.errors, errsCount);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
	}
	exports.resetErrorsCount = resetErrorsCount;
	function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
		/* istanbul ignore if */
		if (errsCount === void 0) throw new Error("ajv implementation error");
		const err = gen.name("err");
		gen.forRange("i", errsCount, names_1.default.errors, (i) => {
			gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
			gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
			gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
			if (it.opts.verbose) {
				gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
				gen.assign((0, codegen_1._)`${err}.data`, data);
			}
		});
	}
	exports.extendErrors = extendErrors;
	function addError(gen, errObj) {
		const err = gen.const("err", errObj);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
		gen.code((0, codegen_1._)`${names_1.default.errors}++`);
	}
	function returnErrors(it, errs) {
		const { gen, validateName, schemaEnv } = it;
		if (schemaEnv.$async) gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
			gen.return(false);
		}
	}
	var E = {
		keyword: new codegen_1.Name("keyword"),
		schemaPath: new codegen_1.Name("schemaPath"),
		params: new codegen_1.Name("params"),
		propertyName: new codegen_1.Name("propertyName"),
		message: new codegen_1.Name("message"),
		schema: new codegen_1.Name("schema"),
		parentSchema: new codegen_1.Name("parentSchema")
	};
	function errorObjectCode(cxt, error, errorPaths) {
		const { createErrors } = cxt.it;
		if (createErrors === false) return (0, codegen_1._)`{}`;
		return errorObject(cxt, error, errorPaths);
	}
	function errorObject(cxt, error, errorPaths = {}) {
		const { gen, it } = cxt;
		const keyValues = [errorInstancePath(it, errorPaths), errorSchemaPath(cxt, errorPaths)];
		extraErrorProps(cxt, error, keyValues);
		return gen.object(...keyValues);
	}
	function errorInstancePath({ errorPath }, { instancePath }) {
		const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
		return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
	}
	function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
		let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
		if (schemaPath) schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
		return [E.schemaPath, schPath];
	}
	function extraErrorProps(cxt, { params, message }, keyValues) {
		const { keyword, data, schemaValue, it } = cxt;
		const { opts, propertyName, topSchemaRef, schemaPath } = it;
		keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
		if (opts.messages) keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
		if (opts.verbose) keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
		if (propertyName) keyValues.push([E.propertyName, propertyName]);
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var boolError = { message: "boolean schema is false" };
	function topBoolOrEmptySchema(it) {
		const { gen, schema, validateName } = it;
		if (schema === false) falseSchemaError(it, false);
		else if (typeof schema == "object" && schema.$async === true) gen.return(names_1.default.data);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, null);
			gen.return(true);
		}
	}
	exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
	function boolOrEmptySchema(it, valid) {
		const { gen, schema } = it;
		if (schema === false) {
			gen.var(valid, false);
			falseSchemaError(it);
		} else gen.var(valid, true);
	}
	exports.boolOrEmptySchema = boolOrEmptySchema;
	function falseSchemaError(it, overrideAllErrors) {
		const { gen, data } = it;
		const cxt = {
			gen,
			keyword: "false schema",
			data,
			schema: false,
			schemaCode: false,
			schemaValue: false,
			params: {},
			it
		};
		(0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/rules.js
var require_rules = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRules = exports.isJSONType = void 0;
	var jsonTypes = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null",
		"object",
		"array"
	]);
	function isJSONType(x) {
		return typeof x == "string" && jsonTypes.has(x);
	}
	exports.isJSONType = isJSONType;
	function getRules() {
		const groups = {
			number: {
				type: "number",
				rules: []
			},
			string: {
				type: "string",
				rules: []
			},
			array: {
				type: "array",
				rules: []
			},
			object: {
				type: "object",
				rules: []
			}
		};
		return {
			types: {
				...groups,
				integer: true,
				boolean: true,
				null: true
			},
			rules: [
				{ rules: [] },
				groups.number,
				groups.string,
				groups.array,
				groups.object
			],
			post: { rules: [] },
			all: {},
			keywords: {}
		};
	}
	exports.getRules = getRules;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
	function schemaHasRulesForType({ schema, self }, type) {
		const group = self.RULES.types[type];
		return group && group !== true && shouldUseGroup(schema, group);
	}
	exports.schemaHasRulesForType = schemaHasRulesForType;
	function shouldUseGroup(schema, group) {
		return group.rules.some((rule) => shouldUseRule(schema, rule));
	}
	exports.shouldUseGroup = shouldUseGroup;
	function shouldUseRule(schema, rule) {
		var _a;
		return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
	}
	exports.shouldUseRule = shouldUseRule;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
	var rules_1 = require_rules();
	var applicability_1 = require_applicability();
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var DataType;
	(function(DataType) {
		DataType[DataType["Correct"] = 0] = "Correct";
		DataType[DataType["Wrong"] = 1] = "Wrong";
	})(DataType || (exports.DataType = DataType = {}));
	function getSchemaTypes(schema) {
		const types = getJSONTypes(schema.type);
		if (types.includes("null")) {
			if (schema.nullable === false) throw new Error("type: null contradicts nullable: false");
		} else {
			if (!types.length && schema.nullable !== void 0) throw new Error("\"nullable\" cannot be used without \"type\"");
			if (schema.nullable === true) types.push("null");
		}
		return types;
	}
	exports.getSchemaTypes = getSchemaTypes;
	function getJSONTypes(ts) {
		const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
		if (types.every(rules_1.isJSONType)) return types;
		throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
	}
	exports.getJSONTypes = getJSONTypes;
	function coerceAndCheckDataType(it, types) {
		const { gen, data, opts } = it;
		const coerceTo = coerceToTypes(types, opts.coerceTypes);
		const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
		if (checkTypes) {
			const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
			gen.if(wrongType, () => {
				if (coerceTo.length) coerceData(it, types, coerceTo);
				else reportTypeError(it);
			});
		}
		return checkTypes;
	}
	exports.coerceAndCheckDataType = coerceAndCheckDataType;
	var COERCIBLE = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	]);
	function coerceToTypes(types, coerceTypes) {
		return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
	}
	function coerceData(it, types, coerceTo) {
		const { gen, data, opts } = it;
		const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
		const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
		if (opts.coerceTypes === "array") gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
		gen.if((0, codegen_1._)`${coerced} !== undefined`);
		for (const t of coerceTo) if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") coerceSpecificType(t);
		gen.else();
		reportTypeError(it);
		gen.endIf();
		gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
			gen.assign(data, coerced);
			assignParentData(it, coerced);
		});
		function coerceSpecificType(t) {
			switch (t) {
				case "string":
					gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
					return;
				case "number":
					gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "integer":
					gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "boolean":
					gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
					return;
				case "null":
					gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
					gen.assign(coerced, null);
					return;
				case "array": gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
			}
		}
	}
	function assignParentData({ gen, parentData, parentDataProperty }, expr) {
		gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
	}
	function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
		const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
		let cond;
		switch (dataType) {
			case "null": return (0, codegen_1._)`${data} ${EQ} null`;
			case "array":
				cond = (0, codegen_1._)`Array.isArray(${data})`;
				break;
			case "object":
				cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
				break;
			case "integer":
				cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
				break;
			case "number":
				cond = numCond();
				break;
			default: return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
		}
		return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
		function numCond(_cond = codegen_1.nil) {
			return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
		}
	}
	exports.checkDataType = checkDataType;
	function checkDataTypes(dataTypes, data, strictNums, correct) {
		if (dataTypes.length === 1) return checkDataType(dataTypes[0], data, strictNums, correct);
		let cond;
		const types = (0, util_1.toHash)(dataTypes);
		if (types.array && types.object) {
			const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
			cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
			delete types.null;
			delete types.array;
			delete types.object;
		} else cond = codegen_1.nil;
		if (types.number) delete types.integer;
		for (const t in types) cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
		return cond;
	}
	exports.checkDataTypes = checkDataTypes;
	var typeError = {
		message: ({ schema }) => `must be ${schema}`,
		params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
	};
	function reportTypeError(it) {
		const cxt = getTypeErrorContext(it);
		(0, errors_1.reportError)(cxt, typeError);
	}
	exports.reportTypeError = reportTypeError;
	function getTypeErrorContext(it) {
		const { gen, data, schema } = it;
		const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
		return {
			gen,
			keyword: "type",
			data,
			schema: schema.type,
			schemaCode,
			schemaValue: schemaCode,
			parentSchema: schema,
			params: {},
			it
		};
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assignDefaults = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function assignDefaults(it, ty) {
		const { properties, items } = it.schema;
		if (ty === "object" && properties) for (const key in properties) assignDefault(it, key, properties[key].default);
		else if (ty === "array" && Array.isArray(items)) items.forEach((sch, i) => assignDefault(it, i, sch.default));
	}
	exports.assignDefaults = assignDefaults;
	function assignDefault(it, prop, defaultValue) {
		const { gen, compositeRule, data, opts } = it;
		if (defaultValue === void 0) return;
		const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
		if (compositeRule) {
			(0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
			return;
		}
		let condition = (0, codegen_1._)`${childData} === undefined`;
		if (opts.useDefaults === "empty") condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
		gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
	}
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/code.js
var require_code = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	var util_2 = require_util();
	function checkReportMissingProp(cxt, prop) {
		const { gen, data, it } = cxt;
		gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
			cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
			cxt.error();
		});
	}
	exports.checkReportMissingProp = checkReportMissingProp;
	function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
		return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
	}
	exports.checkMissingProp = checkMissingProp;
	function reportMissingProp(cxt, missing) {
		cxt.setParams({ missingProperty: missing }, true);
		cxt.error();
	}
	exports.reportMissingProp = reportMissingProp;
	function hasPropFunc(gen) {
		return gen.scopeValue("func", {
			ref: Object.prototype.hasOwnProperty,
			code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
		});
	}
	exports.hasPropFunc = hasPropFunc;
	function isOwnProperty(gen, data, property) {
		return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
	}
	exports.isOwnProperty = isOwnProperty;
	function propertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
		return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
	}
	exports.propertyInData = propertyInData;
	function noPropertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
		return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
	}
	exports.noPropertyInData = noPropertyInData;
	function allSchemaProperties(schemaMap) {
		return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
	}
	exports.allSchemaProperties = allSchemaProperties;
	function schemaProperties(it, schemaMap) {
		return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
	}
	exports.schemaProperties = schemaProperties;
	function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
		const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
		const valCxt = [
			[names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
			[names_1.default.parentData, it.parentData],
			[names_1.default.parentDataProperty, it.parentDataProperty],
			[names_1.default.rootData, names_1.default.rootData]
		];
		if (it.opts.dynamicRef) valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
		const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
		return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
	}
	exports.callValidateCode = callValidateCode;
	var newRegExp = (0, codegen_1._)`new RegExp`;
	function usePattern({ gen, it: { opts } }, pattern) {
		const u = opts.unicodeRegExp ? "u" : "";
		const { regExp } = opts.code;
		const rx = regExp(pattern, u);
		return gen.scopeValue("pattern", {
			key: rx.toString(),
			ref: rx,
			code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
		});
	}
	exports.usePattern = usePattern;
	function validateArray(cxt) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		if (it.allErrors) {
			const validArr = gen.let("valid", true);
			validateItems(() => gen.assign(validArr, false));
			return validArr;
		}
		gen.var(valid, true);
		validateItems(() => gen.break());
		return valid;
		function validateItems(notValid) {
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			gen.forRange("i", 0, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				gen.if((0, codegen_1.not)(valid), notValid);
			});
		}
	}
	exports.validateArray = validateArray;
	function validateUnion(cxt) {
		const { gen, schema, keyword, it } = cxt;
		/* istanbul ignore if */
		if (!Array.isArray(schema)) throw new Error("ajv implementation error");
		if (schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch)) && !it.opts.unevaluated) return;
		const valid = gen.let("valid", false);
		const schValid = gen.name("_valid");
		gen.block(() => schema.forEach((_sch, i) => {
			const schCxt = cxt.subschema({
				keyword,
				schemaProp: i,
				compositeRule: true
			}, schValid);
			gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
			if (!cxt.mergeValidEvaluated(schCxt, schValid)) gen.if((0, codegen_1.not)(valid));
		}));
		cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	}
	exports.validateUnion = validateUnion;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var code_1 = require_code();
	var errors_1 = require_errors();
	function macroKeywordCode(cxt, def) {
		const { gen, keyword, schema, parentSchema, it } = cxt;
		const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
		const schemaRef = useKeyword(gen, keyword, macroSchema);
		if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true);
		const valid = gen.name("valid");
		cxt.subschema({
			schema: macroSchema,
			schemaPath: codegen_1.nil,
			errSchemaPath: `${it.errSchemaPath}/${keyword}`,
			topSchemaRef: schemaRef,
			compositeRule: true
		}, valid);
		cxt.pass(valid, () => cxt.error(true));
	}
	exports.macroKeywordCode = macroKeywordCode;
	function funcKeywordCode(cxt, def) {
		var _a;
		const { gen, keyword, schema, parentSchema, $data, it } = cxt;
		checkAsyncKeyword(it, def);
		const validateRef = useKeyword(gen, keyword, !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate);
		const valid = gen.let("valid");
		cxt.block$data(valid, validateKeyword);
		cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
		function validateKeyword() {
			if (def.errors === false) {
				assignValid();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => cxt.error());
			} else {
				const ruleErrs = def.async ? validateAsync() : validateSync();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => addErrs(cxt, ruleErrs));
			}
		}
		function validateAsync() {
			const ruleErrs = gen.let("ruleErrs", null);
			gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
			return ruleErrs;
		}
		function validateSync() {
			const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
			gen.assign(validateErrs, null);
			assignValid(codegen_1.nil);
			return validateErrs;
		}
		function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
			const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
			const passSchema = !("compile" in def && !$data || def.schema === false);
			gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
		}
		function reportErrs(errors) {
			var _a;
			gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
		}
	}
	exports.funcKeywordCode = funcKeywordCode;
	function modifyData(cxt) {
		const { gen, data, it } = cxt;
		gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
	}
	function addErrs(cxt, errs) {
		const { gen } = cxt;
		gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
			(0, errors_1.extendErrors)(cxt);
		}, () => cxt.error());
	}
	function checkAsyncKeyword({ schemaEnv }, def) {
		if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema");
	}
	function useKeyword(gen, keyword, result) {
		if (result === void 0) throw new Error(`keyword "${keyword}" failed to compile`);
		return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : {
			ref: result,
			code: (0, codegen_1.stringify)(result)
		});
	}
	function validSchemaType(schema, schemaType, allowUndefined = false) {
		return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
	}
	exports.validSchemaType = validSchemaType;
	function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
		/* istanbul ignore if */
		if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) throw new Error("ajv implementation error");
		const deps = def.dependencies;
		if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
		if (def.validateSchema) {
			if (!def.validateSchema(schema[keyword])) {
				const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
				if (opts.validateSchema === "log") self.logger.error(msg);
				else throw new Error(msg);
			}
		}
	}
	exports.validateKeywordUsage = validateKeywordUsage;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
		if (keyword !== void 0 && schema !== void 0) throw new Error("both \"keyword\" and \"schema\" passed, only one allowed");
		if (keyword !== void 0) {
			const sch = it.schema[keyword];
			return schemaProp === void 0 ? {
				schema: sch,
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}`
			} : {
				schema: sch[schemaProp],
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
			};
		}
		if (schema !== void 0) {
			if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) throw new Error("\"schemaPath\", \"errSchemaPath\" and \"topSchemaRef\" are required with \"schema\"");
			return {
				schema,
				schemaPath,
				topSchemaRef,
				errSchemaPath
			};
		}
		throw new Error("either \"keyword\" or \"schema\" must be passed");
	}
	exports.getSubschema = getSubschema;
	function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
		if (data !== void 0 && dataProp !== void 0) throw new Error("both \"data\" and \"dataProp\" passed, only one allowed");
		const { gen } = it;
		if (dataProp !== void 0) {
			const { errorPath, dataPathArr, opts } = it;
			dataContextProps(gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true));
			subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
			subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
			subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
		}
		if (data !== void 0) {
			dataContextProps(data instanceof codegen_1.Name ? data : gen.let("data", data, true));
			if (propertyName !== void 0) subschema.propertyName = propertyName;
		}
		if (dataTypes) subschema.dataTypes = dataTypes;
		function dataContextProps(_nextData) {
			subschema.data = _nextData;
			subschema.dataLevel = it.dataLevel + 1;
			subschema.dataTypes = [];
			it.definedProperties = /* @__PURE__ */ new Set();
			subschema.parentData = it.data;
			subschema.dataNames = [...it.dataNames, _nextData];
		}
	}
	exports.extendSubschemaData = extendSubschemaData;
	function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
		if (compositeRule !== void 0) subschema.compositeRule = compositeRule;
		if (createErrors !== void 0) subschema.createErrors = createErrors;
		if (allErrors !== void 0) subschema.allErrors = allErrors;
		subschema.jtdDiscriminator = jtdDiscriminator;
		subschema.jtdMetadata = jtdMetadata;
	}
	exports.extendSubschemaMode = extendSubschemaMode;
}));
//#endregion
//#region node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
//#endregion
//#region node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var traverse = module.exports = function(schema, opts, cb) {
		if (typeof opts == "function") {
			cb = opts;
			opts = {};
		}
		cb = opts.cb || cb;
		var pre = typeof cb == "function" ? cb : cb.pre || function() {};
		var post = cb.post || function() {};
		_traverse(opts, pre, post, schema, "", schema);
	};
	traverse.keywords = {
		additionalItems: true,
		items: true,
		contains: true,
		additionalProperties: true,
		propertyNames: true,
		not: true,
		if: true,
		then: true,
		else: true
	};
	traverse.arrayKeywords = {
		items: true,
		allOf: true,
		anyOf: true,
		oneOf: true
	};
	traverse.propsKeywords = {
		$defs: true,
		definitions: true,
		properties: true,
		patternProperties: true,
		dependencies: true
	};
	traverse.skipKeywords = {
		default: true,
		enum: true,
		const: true,
		required: true,
		maximum: true,
		minimum: true,
		exclusiveMaximum: true,
		exclusiveMinimum: true,
		multipleOf: true,
		maxLength: true,
		minLength: true,
		pattern: true,
		format: true,
		maxItems: true,
		minItems: true,
		uniqueItems: true,
		maxProperties: true,
		minProperties: true
	};
	function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
		if (schema && typeof schema == "object" && !Array.isArray(schema)) {
			pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
			for (var key in schema) {
				var sch = schema[key];
				if (Array.isArray(sch)) {
					if (key in traverse.arrayKeywords) for (var i = 0; i < sch.length; i++) _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
				} else if (key in traverse.propsKeywords) {
					if (sch && typeof sch == "object") for (var prop in sch) _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
				} else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
			}
			post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
		}
	}
	function escapeJsonPtr(str) {
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
}));
//#endregion
//#region node_modules/ajv/dist/compile/resolve.js
var require_resolve = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
	var util_1 = require_util();
	var equal = require_fast_deep_equal();
	var traverse = require_json_schema_traverse();
	var SIMPLE_INLINED = /* @__PURE__ */ new Set([
		"type",
		"format",
		"pattern",
		"maxLength",
		"minLength",
		"maxProperties",
		"minProperties",
		"maxItems",
		"minItems",
		"maximum",
		"minimum",
		"uniqueItems",
		"multipleOf",
		"required",
		"enum",
		"const"
	]);
	function inlineRef(schema, limit = true) {
		if (typeof schema == "boolean") return true;
		if (limit === true) return !hasRef(schema);
		if (!limit) return false;
		return countKeys(schema) <= limit;
	}
	exports.inlineRef = inlineRef;
	var REF_KEYWORDS = /* @__PURE__ */ new Set([
		"$ref",
		"$recursiveRef",
		"$recursiveAnchor",
		"$dynamicRef",
		"$dynamicAnchor"
	]);
	function hasRef(schema) {
		for (const key in schema) {
			if (REF_KEYWORDS.has(key)) return true;
			const sch = schema[key];
			if (Array.isArray(sch) && sch.some(hasRef)) return true;
			if (typeof sch == "object" && hasRef(sch)) return true;
		}
		return false;
	}
	function countKeys(schema) {
		let count = 0;
		for (const key in schema) {
			if (key === "$ref") return Infinity;
			count++;
			if (SIMPLE_INLINED.has(key)) continue;
			if (typeof schema[key] == "object") (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
			if (count === Infinity) return Infinity;
		}
		return count;
	}
	function getFullPath(resolver, id = "", normalize) {
		if (normalize !== false) id = normalizeId(id);
		return _getFullPath(resolver, resolver.parse(id));
	}
	exports.getFullPath = getFullPath;
	function _getFullPath(resolver, p) {
		return resolver.serialize(p).split("#")[0] + "#";
	}
	exports._getFullPath = _getFullPath;
	var TRAILING_SLASH_HASH = /#\/?$/;
	function normalizeId(id) {
		return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
	}
	exports.normalizeId = normalizeId;
	function resolveUrl(resolver, baseId, id) {
		id = normalizeId(id);
		return resolver.resolve(baseId, id);
	}
	exports.resolveUrl = resolveUrl;
	var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
	function getSchemaRefs(schema, baseId) {
		if (typeof schema == "boolean") return {};
		const { schemaId, uriResolver } = this.opts;
		const schId = normalizeId(schema[schemaId] || baseId);
		const baseIds = { "": schId };
		const pathPrefix = getFullPath(uriResolver, schId, false);
		const localRefs = {};
		const schemaRefs = /* @__PURE__ */ new Set();
		traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
			if (parentJsonPtr === void 0) return;
			const fullPath = pathPrefix + jsonPtr;
			let innerBaseId = baseIds[parentJsonPtr];
			if (typeof sch[schemaId] == "string") innerBaseId = addRef.call(this, sch[schemaId]);
			addAnchor.call(this, sch.$anchor);
			addAnchor.call(this, sch.$dynamicAnchor);
			baseIds[jsonPtr] = innerBaseId;
			function addRef(ref) {
				const _resolve = this.opts.uriResolver.resolve;
				ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
				if (schemaRefs.has(ref)) throw ambiguos(ref);
				schemaRefs.add(ref);
				let schOrRef = this.refs[ref];
				if (typeof schOrRef == "string") schOrRef = this.refs[schOrRef];
				if (typeof schOrRef == "object") checkAmbiguosRef(sch, schOrRef.schema, ref);
				else if (ref !== normalizeId(fullPath)) {
					if (ref[0] === "#") {
						checkAmbiguosRef(sch, localRefs[ref], ref);
						localRefs[ref] = sch;
					} else this.refs[ref] = fullPath;
				}
				return ref;
			}
			function addAnchor(anchor) {
				if (typeof anchor == "string") {
					if (!ANCHOR.test(anchor)) throw new Error(`invalid anchor "${anchor}"`);
					addRef.call(this, `#${anchor}`);
				}
			}
		});
		return localRefs;
		function checkAmbiguosRef(sch1, sch2, ref) {
			if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref);
		}
		function ambiguos(ref) {
			return /* @__PURE__ */ new Error(`reference "${ref}" resolves to more than one schema`);
		}
	}
	exports.getSchemaRefs = getSchemaRefs;
}));
//#endregion
//#region node_modules/ajv/dist/compile/validate/index.js
var require_validate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
	var boolSchema_1 = require_boolSchema();
	var dataType_1 = require_dataType();
	var applicability_1 = require_applicability();
	var dataType_2 = require_dataType();
	var defaults_1 = require_defaults();
	var keyword_1 = require_keyword();
	var subschema_1 = require_subschema();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var errors_1 = require_errors();
	function validateFunctionCode(it) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				topSchemaObjCode(it);
				return;
			}
		}
		validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
	}
	exports.validateFunctionCode = validateFunctionCode;
	function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
		if (opts.code.es5) gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
			gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
			destructureValCxtES5(gen, opts);
			gen.code(body);
		});
		else gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
	}
	function destructureValCxt(opts) {
		return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
	}
	function destructureValCxtES5(gen, opts) {
		gen.if(names_1.default.valCxt, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
			gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
		}, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.rootData, names_1.default.data);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
		});
	}
	function topSchemaObjCode(it) {
		const { schema, opts, gen } = it;
		validateFunction(it, () => {
			if (opts.$comment && schema.$comment) commentKeyword(it);
			checkNoDefault(it);
			gen.let(names_1.default.vErrors, null);
			gen.let(names_1.default.errors, 0);
			if (opts.unevaluated) resetEvaluated(it);
			typeAndKeywords(it);
			returnResults(it);
		});
	}
	function resetEvaluated(it) {
		const { gen, validateName } = it;
		it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
	}
	function funcSourceUrl(schema, opts) {
		const schId = typeof schema == "object" && schema[opts.schemaId];
		return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
	}
	function subschemaCode(it, valid) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				subSchemaObjCode(it, valid);
				return;
			}
		}
		(0, boolSchema_1.boolOrEmptySchema)(it, valid);
	}
	function schemaCxtHasRules({ schema, self }) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (self.RULES.all[key]) return true;
		return false;
	}
	function isSchemaObj(it) {
		return typeof it.schema != "boolean";
	}
	function subSchemaObjCode(it, valid) {
		const { schema, gen, opts } = it;
		if (opts.$comment && schema.$comment) commentKeyword(it);
		updateContext(it);
		checkAsyncSchema(it);
		const errsCount = gen.const("_errs", names_1.default.errors);
		typeAndKeywords(it, errsCount);
		gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
	}
	function checkKeywords(it) {
		(0, util_1.checkUnknownRules)(it);
		checkRefsAndKeywords(it);
	}
	function typeAndKeywords(it, errsCount) {
		if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount);
		const types = (0, dataType_1.getSchemaTypes)(it.schema);
		schemaKeywords(it, types, !(0, dataType_1.coerceAndCheckDataType)(it, types), errsCount);
	}
	function checkRefsAndKeywords(it) {
		const { schema, errSchemaPath, opts, self } = it;
		if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
	}
	function checkNoDefault(it) {
		const { schema, opts } = it;
		if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
	}
	function updateContext(it) {
		const schId = it.schema[it.opts.schemaId];
		if (schId) it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
	}
	function checkAsyncSchema(it) {
		if (it.schema.$async && !it.schemaEnv.$async) throw new Error("async schema in sync schema");
	}
	function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
		const msg = schema.$comment;
		if (opts.$comment === true) gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
		else if (typeof opts.$comment == "function") {
			const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
			const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
			gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
		}
	}
	function returnResults(it) {
		const { gen, schemaEnv, validateName, ValidationError, opts } = it;
		if (schemaEnv.$async) gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
			if (opts.unevaluated) assignEvaluated(it);
			gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
		}
	}
	function assignEvaluated({ gen, evaluated, props, items }) {
		if (props instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.props`, props);
		if (items instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.items`, items);
	}
	function schemaKeywords(it, types, typeErrors, errsCount) {
		const { gen, schema, data, allErrors, opts, self } = it;
		const { RULES } = self;
		if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
			gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
			return;
		}
		if (!opts.jtd) checkStrictTypes(it, types);
		gen.block(() => {
			for (const group of RULES.rules) groupKeywords(group);
			groupKeywords(RULES.post);
		});
		function groupKeywords(group) {
			if (!(0, applicability_1.shouldUseGroup)(schema, group)) return;
			if (group.type) {
				gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
				iterateKeywords(it, group);
				if (types.length === 1 && types[0] === group.type && typeErrors) {
					gen.else();
					(0, dataType_2.reportTypeError)(it);
				}
				gen.endIf();
			} else iterateKeywords(it, group);
			if (!allErrors) gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
		}
	}
	function iterateKeywords(it, group) {
		const { gen, schema, opts: { useDefaults } } = it;
		if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type);
		gen.block(() => {
			for (const rule of group.rules) if ((0, applicability_1.shouldUseRule)(schema, rule)) keywordCode(it, rule.keyword, rule.definition, group.type);
		});
	}
	function checkStrictTypes(it, types) {
		if (it.schemaEnv.meta || !it.opts.strictTypes) return;
		checkContextTypes(it, types);
		if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types);
		checkKeywordTypes(it, it.dataTypes);
	}
	function checkContextTypes(it, types) {
		if (!types.length) return;
		if (!it.dataTypes.length) {
			it.dataTypes = types;
			return;
		}
		types.forEach((t) => {
			if (!includesType(it.dataTypes, t)) strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
		});
		narrowSchemaTypes(it, types);
	}
	function checkMultipleTypes(it, ts) {
		if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) strictTypesError(it, "use allowUnionTypes to allow union type keyword");
	}
	function checkKeywordTypes(it, ts) {
		const rules = it.self.RULES.all;
		for (const keyword in rules) {
			const rule = rules[keyword];
			if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
				const { type } = rule.definition;
				if (type.length && !type.some((t) => hasApplicableType(ts, t))) strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
			}
		}
	}
	function hasApplicableType(schTs, kwdT) {
		return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
	}
	function includesType(ts, t) {
		return ts.includes(t) || t === "integer" && ts.includes("number");
	}
	function narrowSchemaTypes(it, withTypes) {
		const ts = [];
		for (const t of it.dataTypes) if (includesType(withTypes, t)) ts.push(t);
		else if (withTypes.includes("integer") && t === "number") ts.push("integer");
		it.dataTypes = ts;
	}
	function strictTypesError(it, msg) {
		const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
		msg += ` at "${schemaPath}" (strictTypes)`;
		(0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
	}
	var KeywordCxt = class {
		constructor(it, def, keyword) {
			(0, keyword_1.validateKeywordUsage)(it, def, keyword);
			this.gen = it.gen;
			this.allErrors = it.allErrors;
			this.keyword = keyword;
			this.data = it.data;
			this.schema = it.schema[keyword];
			this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
			this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
			this.schemaType = def.schemaType;
			this.parentSchema = it.schema;
			this.params = {};
			this.it = it;
			this.def = def;
			if (this.$data) this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
			else {
				this.schemaCode = this.schemaValue;
				if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
			}
			if ("code" in def ? def.trackErrors : def.errors !== false) this.errsCount = it.gen.const("_errs", names_1.default.errors);
		}
		result(condition, successAction, failAction) {
			this.failResult((0, codegen_1.not)(condition), successAction, failAction);
		}
		failResult(condition, successAction, failAction) {
			this.gen.if(condition);
			if (failAction) failAction();
			else this.error();
			if (successAction) {
				this.gen.else();
				successAction();
				if (this.allErrors) this.gen.endIf();
			} else if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		pass(condition, failAction) {
			this.failResult((0, codegen_1.not)(condition), void 0, failAction);
		}
		fail(condition) {
			if (condition === void 0) {
				this.error();
				if (!this.allErrors) this.gen.if(false);
				return;
			}
			this.gen.if(condition);
			this.error();
			if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		fail$data(condition) {
			if (!this.$data) return this.fail(condition);
			const { schemaCode } = this;
			this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
		}
		error(append, errorParams, errorPaths) {
			if (errorParams) {
				this.setParams(errorParams);
				this._error(append, errorPaths);
				this.setParams({});
				return;
			}
			this._error(append, errorPaths);
		}
		_error(append, errorPaths) {
			(append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
		}
		$dataError() {
			(0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
		}
		reset() {
			if (this.errsCount === void 0) throw new Error("add \"trackErrors\" to keyword definition");
			(0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
		}
		ok(cond) {
			if (!this.allErrors) this.gen.if(cond);
		}
		setParams(obj, assign) {
			if (assign) Object.assign(this.params, obj);
			else this.params = obj;
		}
		block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
			this.gen.block(() => {
				this.check$data(valid, $dataValid);
				codeBlock();
			});
		}
		check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
			if (!this.$data) return;
			const { gen, schemaCode, schemaType, def } = this;
			gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
			if (valid !== codegen_1.nil) gen.assign(valid, true);
			if (schemaType.length || def.validateSchema) {
				gen.elseIf(this.invalid$data());
				this.$dataError();
				if (valid !== codegen_1.nil) gen.assign(valid, false);
			}
			gen.else();
		}
		invalid$data() {
			const { gen, schemaCode, schemaType, def, it } = this;
			return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
			function wrong$DataType() {
				if (schemaType.length) {
					/* istanbul ignore if */
					if (!(schemaCode instanceof codegen_1.Name)) throw new Error("ajv implementation error");
					const st = Array.isArray(schemaType) ? schemaType : [schemaType];
					return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
				}
				return codegen_1.nil;
			}
			function invalid$DataSchema() {
				if (def.validateSchema) {
					const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
					return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
				}
				return codegen_1.nil;
			}
		}
		subschema(appl, valid) {
			const subschema = (0, subschema_1.getSubschema)(this.it, appl);
			(0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
			(0, subschema_1.extendSubschemaMode)(subschema, appl);
			const nextContext = {
				...this.it,
				...subschema,
				items: void 0,
				props: void 0
			};
			subschemaCode(nextContext, valid);
			return nextContext;
		}
		mergeEvaluated(schemaCxt, toName) {
			const { it, gen } = this;
			if (!it.opts.unevaluated) return;
			if (it.props !== true && schemaCxt.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
			if (it.items !== true && schemaCxt.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
		}
		mergeValidEvaluated(schemaCxt, valid) {
			const { it, gen } = this;
			if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
				gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
				return true;
			}
		}
	};
	exports.KeywordCxt = KeywordCxt;
	function keywordCode(it, keyword, def, ruleType) {
		const cxt = new KeywordCxt(it, def, keyword);
		if ("code" in def) def.code(cxt, ruleType);
		else if (cxt.$data && def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
		else if ("macro" in def) (0, keyword_1.macroKeywordCode)(cxt, def);
		else if (def.compile || def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
	}
	var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
	var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
	function getData($data, { dataLevel, dataNames, dataPathArr }) {
		let jsonPointer;
		let data;
		if ($data === "") return names_1.default.rootData;
		if ($data[0] === "/") {
			if (!JSON_POINTER.test($data)) throw new Error(`Invalid JSON-pointer: ${$data}`);
			jsonPointer = $data;
			data = names_1.default.rootData;
		} else {
			const matches = RELATIVE_JSON_POINTER.exec($data);
			if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`);
			const up = +matches[1];
			jsonPointer = matches[2];
			if (jsonPointer === "#") {
				if (up >= dataLevel) throw new Error(errorMsg("property/index", up));
				return dataPathArr[dataLevel - up];
			}
			if (up > dataLevel) throw new Error(errorMsg("data", up));
			data = dataNames[dataLevel - up];
			if (!jsonPointer) return data;
		}
		let expr = data;
		const segments = jsonPointer.split("/");
		for (const segment of segments) if (segment) {
			data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
			expr = (0, codegen_1._)`${expr} && ${data}`;
		}
		return expr;
		function errorMsg(pointerType, up) {
			return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
		}
	}
	exports.getData = getData;
}));
//#endregion
//#region node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ValidationError = class extends Error {
		constructor(errors) {
			super("validation failed");
			this.errors = errors;
			this.ajv = this.validation = true;
		}
	};
	exports.default = ValidationError;
}));
//#endregion
//#region node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var resolve_1 = require_resolve();
	var MissingRefError = class extends Error {
		constructor(resolver, baseId, ref, msg) {
			super(msg || `can't resolve reference ${ref} from id ${baseId}`);
			this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
			this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
		}
	};
	exports.default = MissingRefError;
}));
//#endregion
//#region node_modules/ajv/dist/compile/index.js
var require_compile = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
	var codegen_1 = require_codegen();
	var validation_error_1 = require_validation_error();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var validate_1 = require_validate();
	var SchemaEnv = class {
		constructor(env) {
			var _a;
			this.refs = {};
			this.dynamicAnchors = {};
			let schema;
			if (typeof env.schema == "object") schema = env.schema;
			this.schema = env.schema;
			this.schemaId = env.schemaId;
			this.root = env.root || this;
			this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
			this.schemaPath = env.schemaPath;
			this.localRefs = env.localRefs;
			this.meta = env.meta;
			this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
			this.refs = {};
		}
	};
	exports.SchemaEnv = SchemaEnv;
	function compileSchema(sch) {
		const _sch = getCompilingSchema.call(this, sch);
		if (_sch) return _sch;
		const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
		const { es5, lines } = this.opts.code;
		const { ownProperties } = this.opts;
		const gen = new codegen_1.CodeGen(this.scope, {
			es5,
			lines,
			ownProperties
		});
		let _ValidationError;
		if (sch.$async) _ValidationError = gen.scopeValue("Error", {
			ref: validation_error_1.default,
			code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
		});
		const validateName = gen.scopeName("validate");
		sch.validateName = validateName;
		const schemaCxt = {
			gen,
			allErrors: this.opts.allErrors,
			data: names_1.default.data,
			parentData: names_1.default.parentData,
			parentDataProperty: names_1.default.parentDataProperty,
			dataNames: [names_1.default.data],
			dataPathArr: [codegen_1.nil],
			dataLevel: 0,
			dataTypes: [],
			definedProperties: /* @__PURE__ */ new Set(),
			topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? {
				ref: sch.schema,
				code: (0, codegen_1.stringify)(sch.schema)
			} : { ref: sch.schema }),
			validateName,
			ValidationError: _ValidationError,
			schema: sch.schema,
			schemaEnv: sch,
			rootId,
			baseId: sch.baseId || rootId,
			schemaPath: codegen_1.nil,
			errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
			errorPath: (0, codegen_1._)`""`,
			opts: this.opts,
			self: this
		};
		let sourceCode;
		try {
			this._compilations.add(sch);
			(0, validate_1.validateFunctionCode)(schemaCxt);
			gen.optimize(this.opts.code.optimize);
			const validateCode = gen.toString();
			sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
			if (this.opts.code.process) sourceCode = this.opts.code.process(sourceCode, sch);
			const validate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode)(this, this.scope.get());
			this.scope.value(validateName, { ref: validate });
			validate.errors = null;
			validate.schema = sch.schema;
			validate.schemaEnv = sch;
			if (sch.$async) validate.$async = true;
			if (this.opts.code.source === true) validate.source = {
				validateName,
				validateCode,
				scopeValues: gen._values
			};
			if (this.opts.unevaluated) {
				const { props, items } = schemaCxt;
				validate.evaluated = {
					props: props instanceof codegen_1.Name ? void 0 : props,
					items: items instanceof codegen_1.Name ? void 0 : items,
					dynamicProps: props instanceof codegen_1.Name,
					dynamicItems: items instanceof codegen_1.Name
				};
				if (validate.source) validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
			}
			sch.validate = validate;
			return sch;
		} catch (e) {
			delete sch.validate;
			delete sch.validateName;
			if (sourceCode) this.logger.error("Error compiling schema, function code:", sourceCode);
			throw e;
		} finally {
			this._compilations.delete(sch);
		}
	}
	exports.compileSchema = compileSchema;
	function resolveRef(root, baseId, ref) {
		var _a;
		ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
		const schOrFunc = root.refs[ref];
		if (schOrFunc) return schOrFunc;
		let _sch = resolve.call(this, root, ref);
		if (_sch === void 0) {
			const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
			const { schemaId } = this.opts;
			if (schema) _sch = new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		if (_sch === void 0) return;
		return root.refs[ref] = inlineOrCompile.call(this, _sch);
	}
	exports.resolveRef = resolveRef;
	function inlineOrCompile(sch) {
		if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs)) return sch.schema;
		return sch.validate ? sch : compileSchema.call(this, sch);
	}
	function getCompilingSchema(schEnv) {
		for (const sch of this._compilations) if (sameSchemaEnv(sch, schEnv)) return sch;
	}
	exports.getCompilingSchema = getCompilingSchema;
	function sameSchemaEnv(s1, s2) {
		return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
	}
	function resolve(root, ref) {
		let sch;
		while (typeof (sch = this.refs[ref]) == "string") ref = sch;
		return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
	}
	function resolveSchema(root, ref) {
		const p = this.opts.uriResolver.parse(ref);
		const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
		let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
		if (Object.keys(root.schema).length > 0 && refPath === baseId) return getJsonPointer.call(this, p, root);
		const id = (0, resolve_1.normalizeId)(refPath);
		const schOrRef = this.refs[id] || this.schemas[id];
		if (typeof schOrRef == "string") {
			const sch = resolveSchema.call(this, root, schOrRef);
			if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object") return;
			return getJsonPointer.call(this, p, sch);
		}
		if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object") return;
		if (!schOrRef.validate) compileSchema.call(this, schOrRef);
		if (id === (0, resolve_1.normalizeId)(ref)) {
			const { schema } = schOrRef;
			const { schemaId } = this.opts;
			const schId = schema[schemaId];
			if (schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
			return new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		return getJsonPointer.call(this, p, schOrRef);
	}
	exports.resolveSchema = resolveSchema;
	var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"enum",
		"dependencies",
		"definitions"
	]);
	function getJsonPointer(parsedRef, { baseId, schema, root }) {
		var _a;
		if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/") return;
		for (const part of parsedRef.fragment.slice(1).split("/")) {
			if (typeof schema === "boolean") return;
			const partSchema = schema[(0, util_1.unescapeFragment)(part)];
			if (partSchema === void 0) return;
			schema = partSchema;
			const schId = typeof schema === "object" && schema[this.opts.schemaId];
			if (!PREVENT_SCOPE_CHANGE.has(part) && schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
		}
		let env;
		if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
			const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
			env = resolveSchema.call(this, root, $ref);
		}
		const { schemaId } = this.opts;
		env = env || new SchemaEnv({
			schema,
			schemaId,
			root,
			baseId
		});
		if (env.schema !== env.root.schema) return env;
	}
}));
//#endregion
//#region node_modules/ajv/dist/refs/data.json
var data_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$1,
	additionalProperties: () => false,
	default: () => data_default,
	description: () => description,
	properties: () => properties$1,
	required: () => required,
	type: () => type$1
}), $id$1, description, type$1, required, properties$1, data_default;
var init_data = __esmMin((() => {
	$id$1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
	description = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
	type$1 = "object";
	required = ["$data"];
	properties$1 = { "$data": {
		"type": "string",
		"anyOf": [{ "format": "relative-json-pointer" }, { "format": "json-pointer" }]
	} };
	data_default = {
		$id: $id$1,
		description,
		type: type$1,
		required,
		properties: properties$1,
		additionalProperties: false
	};
}));
//#endregion
//#region node_modules/fast-uri/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {(value: string) => boolean} */
	var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
	/** @type {(value: string) => boolean} */
	var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
	/** @type {(value: string) => boolean} */
	var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
	/** @type {(value: string) => boolean} */
	var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
	/** @type {(value: string) => boolean} */
	var isPathCharacter = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
	/**
	* @param {Array<string>} input
	* @returns {string}
	*/
	function stringArrayToHexStripped(input) {
		let acc = "";
		let code = 0;
		let i = 0;
		for (i = 0; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (code === 48) continue;
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
			break;
		}
		for (i += 1; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
		}
		return acc;
	}
	/**
	* @typedef {Object} GetIPV6Result
	* @property {boolean} error - Indicates if there was an error parsing the IPv6 address.
	* @property {string} address - The parsed IPv6 address.
	* @property {string} [zone] - The zone identifier, if present.
	*/
	/**
	* @param {string} value
	* @returns {boolean}
	*/
	var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
	/**
	* @param {Array<string>} buffer
	* @returns {boolean}
	*/
	function consumeIsZone(buffer) {
		buffer.length = 0;
		return true;
	}
	/**
	* @param {Array<string>} buffer
	* @param {Array<string>} address
	* @param {GetIPV6Result} output
	* @returns {boolean}
	*/
	function consumeHextets(buffer, address, output) {
		if (buffer.length) {
			const hex = stringArrayToHexStripped(buffer);
			if (hex !== "") address.push(hex);
			else {
				output.error = true;
				return false;
			}
			buffer.length = 0;
		}
		return true;
	}
	/**
	* @param {string} input
	* @returns {GetIPV6Result}
	*/
	function getIPV6(input) {
		let tokenCount = 0;
		const output = {
			error: false,
			address: "",
			zone: ""
		};
		/** @type {Array<string>} */
		const address = [];
		/** @type {Array<string>} */
		const buffer = [];
		let endipv6Encountered = false;
		let endIpv6 = false;
		let consume = consumeHextets;
		for (let i = 0; i < input.length; i++) {
			const cursor = input[i];
			if (cursor === "[" || cursor === "]") continue;
			if (cursor === ":") {
				if (endipv6Encountered === true) endIpv6 = true;
				if (!consume(buffer, address, output)) break;
				if (++tokenCount > 7) {
					output.error = true;
					break;
				}
				if (i > 0 && input[i - 1] === ":") endipv6Encountered = true;
				address.push(":");
				continue;
			} else if (cursor === "%") {
				if (!consume(buffer, address, output)) break;
				consume = consumeIsZone;
			} else {
				buffer.push(cursor);
				continue;
			}
		}
		if (buffer.length) {
			if (consume === consumeIsZone) output.zone = buffer.join("");
			else if (endIpv6) address.push(buffer.join(""));
			else address.push(stringArrayToHexStripped(buffer));
		}
		output.address = address.join("");
		return output;
	}
	/**
	* @typedef {Object} NormalizeIPv6Result
	* @property {string} host - The normalized host.
	* @property {string} [escapedHost] - The escaped host.
	* @property {boolean} isIPV6 - Indicates if the host is an IPv6 address.
	*/
	/**
	* @param {string} host
	* @returns {NormalizeIPv6Result}
	*/
	function normalizeIPv6(host) {
		if (findToken(host, ":") < 2) return {
			host,
			isIPV6: false
		};
		const ipv6 = getIPV6(host);
		if (!ipv6.error) {
			let newHost = ipv6.address;
			let escapedHost = ipv6.address;
			if (ipv6.zone) {
				newHost += "%" + ipv6.zone;
				escapedHost += "%25" + ipv6.zone;
			}
			return {
				host: newHost,
				isIPV6: true,
				escapedHost
			};
		} else return {
			host,
			isIPV6: false
		};
	}
	/**
	* @param {string} str
	* @param {string} token
	* @returns {number}
	*/
	function findToken(str, token) {
		let ind = 0;
		for (let i = 0; i < str.length; i++) if (str[i] === token) ind++;
		return ind;
	}
	/**
	* @param {string} path
	* @returns {string}
	*
	* @see https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
	*/
	function removeDotSegments(path) {
		let input = path;
		const output = [];
		let nextSlash = -1;
		let len = 0;
		while (len = input.length) {
			if (len === 1) {
				if (input === ".") break;
				else if (input === "/") {
					output.push("/");
					break;
				} else {
					output.push(input);
					break;
				}
			} else if (len === 2) {
				if (input[0] === ".") {
					if (input[1] === ".") break;
					else if (input[1] === "/") {
						input = input.slice(2);
						continue;
					}
				} else if (input[0] === "/") {
					if (input[1] === "." || input[1] === "/") {
						output.push("/");
						break;
					}
				}
			} else if (len === 3) {
				if (input === "/..") {
					if (output.length !== 0) output.pop();
					output.push("/");
					break;
				}
			}
			if (input[0] === ".") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(3);
						continue;
					}
				} else if (input[1] === "/") {
					input = input.slice(2);
					continue;
				}
			} else if (input[0] === "/") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(2);
						continue;
					} else if (input[2] === ".") {
						if (input[3] === "/") {
							input = input.slice(3);
							if (output.length !== 0) output.pop();
							continue;
						}
					}
				}
			}
			if ((nextSlash = input.indexOf("/", 1)) === -1) {
				output.push(input);
				break;
			} else {
				output.push(input.slice(0, nextSlash));
				input = input.slice(nextSlash);
			}
		}
		return output.join("");
	}
	/**
	* Re-escape RFC 3986 gen-delims that must not appear literally in the host.
	* After the URI regex parses, these characters cannot be literal in the host
	* field, so any that appear after decoding came from percent-encoding and
	* must be restored to prevent authority structure changes.
	*
	* @param {string} host
	* @param {boolean} isIP - true for IPv4/IPv6 hosts (skip colon re-escaping)
	* @returns {string}
	*/
	var HOST_DELIMS = {
		"@": "%40",
		"/": "%2F",
		"?": "%3F",
		"#": "%23",
		":": "%3A"
	};
	var HOST_DELIM_RE = /[@/?#:]/g;
	var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
	function reescapeHostDelimiters(host, isIP) {
		const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
		re.lastIndex = 0;
		return host.replace(re, (ch) => HOST_DELIMS[ch]);
	}
	/**
	* Normalizes percent escapes and optionally decodes only unreserved ASCII bytes.
	* Reserved delimiters such as `%2F` and `%2E` stay escaped.
	*
	* @param {string} input
	* @param {boolean} [decodeUnreserved=false]
	* @returns {string}
	*/
	function normalizePercentEncoding(input, decodeUnreserved = false) {
		if (input.indexOf("%") === -1) return input;
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decodeUnreserved && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			output += input[i];
		}
		return output;
	}
	/**
	* Normalizes path data without turning reserved escapes into live path syntax.
	* Valid escapes are uppercased, raw unsafe characters are escaped, and only
	* unreserved bytes that are not `.` are decoded.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizePathEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decoded !== "." && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isPathCharacter(input[i])) output += input[i];
			else output += escape(input[i]);
		}
		return output;
	}
	/**
	* Escapes a component while preserving existing valid percent escapes.
	*
	* @param {string} input
	* @returns {string}
	*/
	function escapePreservingEscapes(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			output += escape(input[i]);
		}
		return output;
	}
	/**
	* @param {import('../types/index').URIComponent} component
	* @returns {string|undefined}
	*/
	function recomposeAuthority(component) {
		const uriTokens = [];
		if (component.userinfo !== void 0) {
			uriTokens.push(component.userinfo);
			uriTokens.push("@");
		}
		if (component.host !== void 0) {
			let host = unescape(component.host);
			if (!isIPv4(host)) {
				const ipV6res = normalizeIPv6(host);
				if (ipV6res.isIPV6 === true) host = `[${ipV6res.escapedHost}]`;
				else host = reescapeHostDelimiters(host, false);
			}
			uriTokens.push(host);
		}
		if (typeof component.port === "number" || typeof component.port === "string") {
			uriTokens.push(":");
			uriTokens.push(String(component.port));
		}
		return uriTokens.length ? uriTokens.join("") : void 0;
	}
	module.exports = {
		nonSimpleDomain,
		recomposeAuthority,
		reescapeHostDelimiters,
		normalizePercentEncoding,
		normalizePathEncoding,
		escapePreservingEscapes,
		removeDotSegments,
		isIPv4,
		isUUID,
		normalizeIPv6,
		stringArrayToHexStripped
	};
}));
//#endregion
//#region node_modules/fast-uri/lib/schemes.js
var require_schemes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUUID } = require_utils();
	var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
	var supportedSchemeNames = [
		"http",
		"https",
		"ws",
		"wss",
		"urn",
		"urn:uuid"
	];
	/** @typedef {supportedSchemeNames[number]} SchemeName */
	/**
	* @param {string} name
	* @returns {name is SchemeName}
	*/
	function isValidSchemeName(name) {
		return supportedSchemeNames.indexOf(name) !== -1;
	}
	/**
	* @callback SchemeFn
	* @param {import('../types/index').URIComponent} component
	* @param {import('../types/index').Options} options
	* @returns {import('../types/index').URIComponent}
	*/
	/**
	* @typedef {Object} SchemeHandler
	* @property {SchemeName} scheme - The scheme name.
	* @property {boolean} [domainHost] - Indicates if the scheme supports domain hosts.
	* @property {SchemeFn} parse - Function to parse the URI component for this scheme.
	* @property {SchemeFn} serialize - Function to serialize the URI component for this scheme.
	* @property {boolean} [skipNormalize] - Indicates if normalization should be skipped for this scheme.
	* @property {boolean} [absolutePath] - Indicates if the scheme uses absolute paths.
	* @property {boolean} [unicodeSupport] - Indicates if the scheme supports Unicode.
	*/
	/**
	* @param {import('../types/index').URIComponent} wsComponent
	* @returns {boolean}
	*/
	function wsIsSecure(wsComponent) {
		if (wsComponent.secure === true) return true;
		else if (wsComponent.secure === false) return false;
		else if (wsComponent.scheme) return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
		else return false;
	}
	/** @type {SchemeFn} */
	function httpParse(component) {
		if (!component.host) component.error = component.error || "HTTP URIs must have a host.";
		return component;
	}
	/** @type {SchemeFn} */
	function httpSerialize(component) {
		const secure = String(component.scheme).toLowerCase() === "https";
		if (component.port === (secure ? 443 : 80) || component.port === "") component.port = void 0;
		if (!component.path) component.path = "/";
		return component;
	}
	/** @type {SchemeFn} */
	function wsParse(wsComponent) {
		wsComponent.secure = wsIsSecure(wsComponent);
		wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
		wsComponent.path = void 0;
		wsComponent.query = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function wsSerialize(wsComponent) {
		if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") wsComponent.port = void 0;
		if (typeof wsComponent.secure === "boolean") {
			wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
			wsComponent.secure = void 0;
		}
		if (wsComponent.resourceName) {
			const [path, query] = wsComponent.resourceName.split("?");
			wsComponent.path = path && path !== "/" ? path : void 0;
			wsComponent.query = query;
			wsComponent.resourceName = void 0;
		}
		wsComponent.fragment = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function urnParse(urnComponent, options) {
		if (!urnComponent.path) {
			urnComponent.error = "URN can not be parsed";
			return urnComponent;
		}
		const matches = urnComponent.path.match(URN_REG);
		if (matches) {
			const scheme = options.scheme || urnComponent.scheme || "urn";
			urnComponent.nid = matches[1].toLowerCase();
			urnComponent.nss = matches[2];
			const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || urnComponent.nid}`);
			urnComponent.path = void 0;
			if (schemeHandler) urnComponent = schemeHandler.parse(urnComponent, options);
		} else urnComponent.error = urnComponent.error || "URN can not be parsed.";
		return urnComponent;
	}
	/** @type {SchemeFn} */
	function urnSerialize(urnComponent, options) {
		if (urnComponent.nid === void 0) throw new Error("URN without nid cannot be serialized");
		const scheme = options.scheme || urnComponent.scheme || "urn";
		const nid = urnComponent.nid.toLowerCase();
		const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || nid}`);
		if (schemeHandler) urnComponent = schemeHandler.serialize(urnComponent, options);
		const uriComponent = urnComponent;
		const nss = urnComponent.nss;
		uriComponent.path = `${nid || options.nid}:${nss}`;
		options.skipEscape = true;
		return uriComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidParse(urnComponent, options) {
		const uuidComponent = urnComponent;
		uuidComponent.uuid = uuidComponent.nss;
		uuidComponent.nss = void 0;
		if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) uuidComponent.error = uuidComponent.error || "UUID is not valid.";
		return uuidComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidSerialize(uuidComponent) {
		const urnComponent = uuidComponent;
		urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
		return urnComponent;
	}
	var http = {
		scheme: "http",
		domainHost: true,
		parse: httpParse,
		serialize: httpSerialize
	};
	var https = {
		scheme: "https",
		domainHost: http.domainHost,
		parse: httpParse,
		serialize: httpSerialize
	};
	var ws = {
		scheme: "ws",
		domainHost: true,
		parse: wsParse,
		serialize: wsSerialize
	};
	var SCHEMES = {
		http,
		https,
		ws,
		wss: {
			scheme: "wss",
			domainHost: ws.domainHost,
			parse: ws.parse,
			serialize: ws.serialize
		},
		urn: {
			scheme: "urn",
			parse: urnParse,
			serialize: urnSerialize,
			skipNormalize: true
		},
		"urn:uuid": {
			scheme: "urn:uuid",
			parse: urnuuidParse,
			serialize: urnuuidSerialize,
			skipNormalize: true
		}
	};
	Object.setPrototypeOf(SCHEMES, null);
	/**
	* @param {string|undefined} scheme
	* @returns {SchemeHandler|undefined}
	*/
	function getSchemeHandler(scheme) {
		return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || void 0;
	}
	module.exports = {
		wsIsSecure,
		SCHEMES,
		isValidSchemeName,
		getSchemeHandler
	};
}));
//#endregion
//#region node_modules/fast-uri/index.js
var require_fast_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, escapePreservingEscapes, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
	var { SCHEMES, getSchemeHandler } = require_schemes();
	/**
	* @template {import('./types/index').URIComponent|string} T
	* @param {T} uri
	* @param {import('./types/index').Options} [options]
	* @returns {T}
	*/
	function normalize(uri, options) {
		if (typeof uri === "string") uri = normalizeString(uri, options);
		else if (typeof uri === "object") uri = parse(serialize(uri, options), options);
		return uri;
	}
	/**
	* @param {string} baseURI
	* @param {string} relativeURI
	* @param {import('./types/index').Options} [options]
	* @returns {string}
	*/
	function resolve(baseURI, relativeURI, options) {
		const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
		const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed } = parseWithStatus(baseURI, schemelessOptions);
		const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed } = parseWithStatus(relativeURI, schemelessOptions);
		if (baseMalformed || relativeMalformed) throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
		const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
		schemelessOptions.skipEscape = true;
		return serialize(resolved, schemelessOptions);
	}
	/**
	* @param {import ('./types/index').URIComponent} base
	* @param {import ('./types/index').URIComponent} relative
	* @param {import('./types/index').Options} [options]
	* @param {boolean} [skipNormalization=false]
	* @returns {import ('./types/index').URIComponent}
	*/
	function resolveComponent(base, relative, options, skipNormalization) {
		/** @type {import('./types/index').URIComponent} */
		const target = {};
		if (!skipNormalization) {
			base = parse(serialize(base, options), options);
			relative = parse(serialize(relative, options), options);
		}
		options = options || {};
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = removeDotSegments(relative.path || "");
			target.query = relative.query;
		} else {
			if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = removeDotSegments(relative.path || "");
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== void 0) target.query = relative.query;
					else target.query = base.query;
				} else {
					if (relative.path[0] === "/") target.path = removeDotSegments(relative.path);
					else {
						if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) target.path = "/" + relative.path;
						else if (!base.path) target.path = relative.path;
						else target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						target.path = removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		target.fragment = relative.fragment;
		return target;
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uriA
	* @param {import ('./types/index').URIComponent|string} uriB
	* @param {import ('./types/index').Options} options
	* @returns {boolean}
	*/
	function equal(uriA, uriB, options) {
		const normalizedA = normalizeComparableURI(uriA, options);
		const normalizedB = normalizeComparableURI(uriB, options);
		return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA.toLowerCase() === normalizedB.toLowerCase();
	}
	/**
	* @param {Readonly<import('./types/index').URIComponent>} cmpts
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function serialize(cmpts, opts) {
		const component = {
			host: cmpts.host,
			scheme: cmpts.scheme,
			userinfo: cmpts.userinfo,
			port: cmpts.port,
			path: cmpts.path,
			query: cmpts.query,
			nid: cmpts.nid,
			nss: cmpts.nss,
			uuid: cmpts.uuid,
			fragment: cmpts.fragment,
			reference: cmpts.reference,
			resourceName: cmpts.resourceName,
			secure: cmpts.secure,
			error: ""
		};
		const options = Object.assign({}, opts);
		const uriTokens = [];
		const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
		if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
		if (component.path !== void 0) {
			if (!options.skipEscape) {
				component.path = escapePreservingEscapes(component.path);
				if (component.scheme !== void 0) component.path = component.path.split("%3A").join(":");
			} else component.path = normalizePercentEncoding(component.path);
		}
		if (options.reference !== "suffix" && component.scheme) uriTokens.push(component.scheme, ":");
		const authority = recomposeAuthority(component);
		if (authority !== void 0) {
			if (options.reference !== "suffix") uriTokens.push("//");
			uriTokens.push(authority);
			if (component.path && component.path[0] !== "/") uriTokens.push("/");
		}
		if (component.path !== void 0) {
			let s = component.path;
			if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) s = removeDotSegments(s);
			if (authority === void 0 && s[0] === "/" && s[1] === "/") s = "/%2F" + s.slice(2);
			uriTokens.push(s);
		}
		if (component.query !== void 0) uriTokens.push("?", component.query);
		if (component.fragment !== void 0) uriTokens.push("#", component.fragment);
		return uriTokens.join("");
	}
	var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
	var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
	var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {RegExpMatchArray} matches
	* @returns {string|undefined}
	*/
	function getParseError(parsed, matches) {
		if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") return "URI path must start with \"/\" when authority is present.";
		if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) return "URI port is malformed.";
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ parsed: import('./types/index').URIComponent, malformedAuthorityOrPort: boolean }}
	*/
	function parseWithStatus(uri, opts) {
		const options = Object.assign({}, opts);
		/** @type {import('./types/index').URIComponent} */
		const parsed = {
			scheme: void 0,
			userinfo: void 0,
			host: "",
			port: void 0,
			path: "",
			query: void 0,
			fragment: void 0
		};
		let malformedAuthorityOrPort = false;
		let isIP = false;
		if (options.reference === "suffix") {
			if (options.scheme) uri = options.scheme + ":" + uri;
			else uri = "//" + uri;
		}
		const authorityMatch = uri.match(AUTHORITY_PREFIX);
		if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
			parsed.error = "URI authority must not contain a literal backslash.";
			malformedAuthorityOrPort = true;
		}
		const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
		if (introducerMatch !== null) {
			const region = introducerMatch[1];
			const normalizedRegion = region.replace(/[\t\n\r]/g, "");
			if (normalizedRegion.length >= 2) {
				if (normalizedRegion.slice(0, 2) !== "//") {
					parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
					malformedAuthorityOrPort = true;
				} else if (region.length !== normalizedRegion.length) {
					parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
					malformedAuthorityOrPort = true;
				}
			}
		}
		const matches = uri.match(URI_PARSE);
		if (matches) {
			parsed.scheme = matches[1];
			parsed.userinfo = matches[3];
			parsed.host = matches[4];
			parsed.port = parseInt(matches[5], 10);
			parsed.path = matches[6] || "";
			parsed.query = matches[7];
			parsed.fragment = matches[8];
			if (isNaN(parsed.port)) parsed.port = matches[5];
			const parseError = getParseError(parsed, matches);
			if (parseError !== void 0) {
				parsed.error = parsed.error || parseError;
				malformedAuthorityOrPort = true;
			}
			if (parsed.host) {
				if (isIPv4(parsed.host) === false) {
					const ipv6result = normalizeIPv6(parsed.host);
					parsed.host = ipv6result.host.toLowerCase();
					isIP = ipv6result.isIPV6;
				} else isIP = true;
			}
			if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) parsed.reference = "same-document";
			else if (parsed.scheme === void 0) parsed.reference = "relative";
			else if (parsed.fragment === void 0) parsed.reference = "absolute";
			else parsed.reference = "uri";
			if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
			const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
			if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
				if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) try {
					parsed.host = new URL("http://" + parsed.host).hostname;
				} catch (e) {
					parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
				}
			}
			if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
				if (uri.indexOf("%") !== -1) {
					if (parsed.scheme !== void 0) parsed.scheme = unescape(parsed.scheme);
					if (parsed.host !== void 0) parsed.host = reescapeHostDelimiters(unescape(parsed.host), isIP);
				}
				if (parsed.path) parsed.path = normalizePathEncoding(parsed.path);
				if (parsed.fragment) try {
					parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
				} catch {
					parsed.error = parsed.error || "URI malformed";
				}
			}
			if (schemeHandler && schemeHandler.parse) schemeHandler.parse(parsed, options);
		} else parsed.error = parsed.error || "URI can not be parsed.";
		return {
			parsed,
			malformedAuthorityOrPort
		};
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns
	*/
	function parse(uri, opts) {
		return parseWithStatus(uri, opts).parsed;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function normalizeString(uri, opts) {
		return normalizeStringWithStatus(uri, opts).normalized;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ normalized: string, malformedAuthorityOrPort: boolean }}
	*/
	function normalizeStringWithStatus(uri, opts) {
		const { parsed, malformedAuthorityOrPort } = parseWithStatus(uri, opts);
		return {
			normalized: malformedAuthorityOrPort ? uri : serialize(parsed, opts),
			malformedAuthorityOrPort
		};
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string|undefined}
	*/
	function normalizeComparableURI(uri, opts) {
		if (typeof uri === "string") {
			const { normalized, malformedAuthorityOrPort } = normalizeStringWithStatus(uri, opts);
			return malformedAuthorityOrPort ? void 0 : normalized;
		}
		if (typeof uri === "object") return serialize(uri, opts);
	}
	var fastUri = {
		SCHEMES,
		normalize,
		resolve,
		resolveComponent,
		equal,
		serialize,
		parse
	};
	module.exports = fastUri;
	module.exports.default = fastUri;
	module.exports.fastUri = fastUri;
}));
//#endregion
//#region node_modules/ajv/dist/runtime/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var uri = require_fast_uri();
	uri.code = "require(\"ajv/dist/runtime/uri\").default";
	exports.default = uri;
}));
//#endregion
//#region node_modules/ajv/dist/core.js
var require_core$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	var ref_error_1 = require_ref_error();
	var rules_1 = require_rules();
	var compile_1 = require_compile();
	var codegen_2 = require_codegen();
	var resolve_1 = require_resolve();
	var dataType_1 = require_dataType();
	var util_1 = require_util();
	var $dataRefSchema = (init_data(), __toCommonJS(data_exports).default);
	var uri_1 = require_uri();
	var defaultRegExp = (str, flags) => new RegExp(str, flags);
	defaultRegExp.code = "new RegExp";
	var META_IGNORE_OPTIONS = [
		"removeAdditional",
		"useDefaults",
		"coerceTypes"
	];
	var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
		"validate",
		"serialize",
		"parse",
		"wrapper",
		"root",
		"schema",
		"keyword",
		"pattern",
		"formats",
		"validate$data",
		"func",
		"obj",
		"Error"
	]);
	var removedOptions = {
		errorDataPath: "",
		format: "`validateFormats: false` can be used instead.",
		nullable: "\"nullable\" keyword is supported by default.",
		jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
		extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
		missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
		processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
		sourceCode: "Use option `code: {source: true}`",
		strictDefaults: "It is default now, see option `strict`.",
		strictKeywords: "It is default now, see option `strict`.",
		uniqueItems: "\"uniqueItems\" keyword is always validated.",
		unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
		cache: "Map is used as cache, schema object as key.",
		serialize: "Map is used as cache, schema object as key.",
		ajvErrors: "It is default now."
	};
	var deprecatedOptions = {
		ignoreKeywordsWithRef: "",
		jsPropertySyntax: "",
		unicode: "\"minLength\"/\"maxLength\" account for unicode characters by default."
	};
	var MAX_EXPRESSION = 200;
	function requiredOptions(o) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
		const s = o.strict;
		const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
		const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
		const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
		const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
		return {
			strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
			strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
			strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
			strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
			strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
			code: o.code ? {
				...o.code,
				optimize,
				regExp
			} : {
				optimize,
				regExp
			},
			loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
			loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
			meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
			messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
			inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
			schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
			addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
			validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
			validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
			unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
			int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
			uriResolver
		};
	}
	var Ajv = class {
		constructor(opts = {}) {
			this.schemas = {};
			this.refs = {};
			this.formats = Object.create(null);
			this._compilations = /* @__PURE__ */ new Set();
			this._loading = {};
			this._cache = /* @__PURE__ */ new Map();
			opts = this.opts = {
				...opts,
				...requiredOptions(opts)
			};
			const { es5, lines } = this.opts.code;
			this.scope = new codegen_2.ValueScope({
				scope: {},
				prefixes: EXT_SCOPE_NAMES,
				es5,
				lines
			});
			this.logger = getLogger(opts.logger);
			const formatOpt = opts.validateFormats;
			opts.validateFormats = false;
			this.RULES = (0, rules_1.getRules)();
			checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
			checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
			this._metaOpts = getMetaSchemaOptions.call(this);
			if (opts.formats) addInitialFormats.call(this);
			this._addVocabularies();
			this._addDefaultMetaSchema();
			if (opts.keywords) addInitialKeywords.call(this, opts.keywords);
			if (typeof opts.meta == "object") this.addMetaSchema(opts.meta);
			addInitialSchemas.call(this);
			opts.validateFormats = formatOpt;
		}
		_addVocabularies() {
			this.addKeyword("$async");
		}
		_addDefaultMetaSchema() {
			const { $data, meta, schemaId } = this.opts;
			let _dataRefSchema = $dataRefSchema;
			if (schemaId === "id") {
				_dataRefSchema = { ...$dataRefSchema };
				_dataRefSchema.id = _dataRefSchema.$id;
				delete _dataRefSchema.$id;
			}
			if (meta && $data) this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
		}
		defaultMeta() {
			const { meta, schemaId } = this.opts;
			return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
		}
		validate(schemaKeyRef, data) {
			let v;
			if (typeof schemaKeyRef == "string") {
				v = this.getSchema(schemaKeyRef);
				if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
			} else v = this.compile(schemaKeyRef);
			const valid = v(data);
			if (!("$async" in v)) this.errors = v.errors;
			return valid;
		}
		compile(schema, _meta) {
			const sch = this._addSchema(schema, _meta);
			return sch.validate || this._compileSchemaEnv(sch);
		}
		compileAsync(schema, meta) {
			if (typeof this.opts.loadSchema != "function") throw new Error("options.loadSchema should be a function");
			const { loadSchema } = this.opts;
			return runCompileAsync.call(this, schema, meta);
			async function runCompileAsync(_schema, _meta) {
				await loadMetaSchema.call(this, _schema.$schema);
				const sch = this._addSchema(_schema, _meta);
				return sch.validate || _compileAsync.call(this, sch);
			}
			async function loadMetaSchema($ref) {
				if ($ref && !this.getSchema($ref)) await runCompileAsync.call(this, { $ref }, true);
			}
			async function _compileAsync(sch) {
				try {
					return this._compileSchemaEnv(sch);
				} catch (e) {
					if (!(e instanceof ref_error_1.default)) throw e;
					checkLoaded.call(this, e);
					await loadMissingSchema.call(this, e.missingSchema);
					return _compileAsync.call(this, sch);
				}
			}
			function checkLoaded({ missingSchema: ref, missingRef }) {
				if (this.refs[ref]) throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
			}
			async function loadMissingSchema(ref) {
				const _schema = await _loadSchema.call(this, ref);
				if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema);
				if (!this.refs[ref]) this.addSchema(_schema, ref, meta);
			}
			async function _loadSchema(ref) {
				const p = this._loading[ref];
				if (p) return p;
				try {
					return await (this._loading[ref] = loadSchema(ref));
				} finally {
					delete this._loading[ref];
				}
			}
		}
		addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
			if (Array.isArray(schema)) {
				for (const sch of schema) this.addSchema(sch, void 0, _meta, _validateSchema);
				return this;
			}
			let id;
			if (typeof schema === "object") {
				const { schemaId } = this.opts;
				id = schema[schemaId];
				if (id !== void 0 && typeof id != "string") throw new Error(`schema ${schemaId} must be string`);
			}
			key = (0, resolve_1.normalizeId)(key || id);
			this._checkUnique(key);
			this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
			return this;
		}
		addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
			this.addSchema(schema, key, true, _validateSchema);
			return this;
		}
		validateSchema(schema, throwOrLogError) {
			if (typeof schema == "boolean") return true;
			let $schema;
			$schema = schema.$schema;
			if ($schema !== void 0 && typeof $schema != "string") throw new Error("$schema must be a string");
			$schema = $schema || this.opts.defaultMeta || this.defaultMeta();
			if (!$schema) {
				this.logger.warn("meta-schema not available");
				this.errors = null;
				return true;
			}
			const valid = this.validate($schema, schema);
			if (!valid && throwOrLogError) {
				const message = "schema is invalid: " + this.errorsText();
				if (this.opts.validateSchema === "log") this.logger.error(message);
				else throw new Error(message);
			}
			return valid;
		}
		getSchema(keyRef) {
			let sch;
			while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch;
			if (sch === void 0) {
				const { schemaId } = this.opts;
				const root = new compile_1.SchemaEnv({
					schema: {},
					schemaId
				});
				sch = compile_1.resolveSchema.call(this, root, keyRef);
				if (!sch) return;
				this.refs[keyRef] = sch;
			}
			return sch.validate || this._compileSchemaEnv(sch);
		}
		removeSchema(schemaKeyRef) {
			if (schemaKeyRef instanceof RegExp) {
				this._removeAllSchemas(this.schemas, schemaKeyRef);
				this._removeAllSchemas(this.refs, schemaKeyRef);
				return this;
			}
			switch (typeof schemaKeyRef) {
				case "undefined":
					this._removeAllSchemas(this.schemas);
					this._removeAllSchemas(this.refs);
					this._cache.clear();
					return this;
				case "string": {
					const sch = getSchEnv.call(this, schemaKeyRef);
					if (typeof sch == "object") this._cache.delete(sch.schema);
					delete this.schemas[schemaKeyRef];
					delete this.refs[schemaKeyRef];
					return this;
				}
				case "object": {
					const cacheKey = schemaKeyRef;
					this._cache.delete(cacheKey);
					let id = schemaKeyRef[this.opts.schemaId];
					if (id) {
						id = (0, resolve_1.normalizeId)(id);
						delete this.schemas[id];
						delete this.refs[id];
					}
					return this;
				}
				default: throw new Error("ajv.removeSchema: invalid parameter");
			}
		}
		addVocabulary(definitions) {
			for (const def of definitions) this.addKeyword(def);
			return this;
		}
		addKeyword(kwdOrDef, def) {
			let keyword;
			if (typeof kwdOrDef == "string") {
				keyword = kwdOrDef;
				if (typeof def == "object") {
					this.logger.warn("these parameters are deprecated, see docs for addKeyword");
					def.keyword = keyword;
				}
			} else if (typeof kwdOrDef == "object" && def === void 0) {
				def = kwdOrDef;
				keyword = def.keyword;
				if (Array.isArray(keyword) && !keyword.length) throw new Error("addKeywords: keyword must be string or non-empty array");
			} else throw new Error("invalid addKeywords parameters");
			checkKeyword.call(this, keyword, def);
			if (!def) {
				(0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
				return this;
			}
			keywordMetaschema.call(this, def);
			const definition = {
				...def,
				type: (0, dataType_1.getJSONTypes)(def.type),
				schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
			};
			(0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
			return this;
		}
		getKeyword(keyword) {
			const rule = this.RULES.all[keyword];
			return typeof rule == "object" ? rule.definition : !!rule;
		}
		removeKeyword(keyword) {
			const { RULES } = this;
			delete RULES.keywords[keyword];
			delete RULES.all[keyword];
			for (const group of RULES.rules) {
				const i = group.rules.findIndex((rule) => rule.keyword === keyword);
				if (i >= 0) group.rules.splice(i, 1);
			}
			return this;
		}
		addFormat(name, format) {
			if (typeof format == "string") format = new RegExp(format);
			this.formats[name] = format;
			return this;
		}
		errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
			if (!errors || errors.length === 0) return "No errors";
			return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
		}
		$dataMetaSchema(metaSchema, keywordsJsonPointers) {
			const rules = this.RULES.all;
			metaSchema = JSON.parse(JSON.stringify(metaSchema));
			for (const jsonPointer of keywordsJsonPointers) {
				const segments = jsonPointer.split("/").slice(1);
				let keywords = metaSchema;
				for (const seg of segments) keywords = keywords[seg];
				for (const key in rules) {
					const rule = rules[key];
					if (typeof rule != "object") continue;
					const { $data } = rule.definition;
					const schema = keywords[key];
					if ($data && schema) keywords[key] = schemaOrData(schema);
				}
			}
			return metaSchema;
		}
		_removeAllSchemas(schemas, regex) {
			for (const keyRef in schemas) {
				const sch = schemas[keyRef];
				if (!regex || regex.test(keyRef)) {
					if (typeof sch == "string") delete schemas[keyRef];
					else if (sch && !sch.meta) {
						this._cache.delete(sch.schema);
						delete schemas[keyRef];
					}
				}
			}
		}
		_addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
			let id;
			const { schemaId } = this.opts;
			if (typeof schema == "object") id = schema[schemaId];
			else if (this.opts.jtd) throw new Error("schema must be object");
			else if (typeof schema != "boolean") throw new Error("schema must be object or boolean");
			let sch = this._cache.get(schema);
			if (sch !== void 0) return sch;
			baseId = (0, resolve_1.normalizeId)(id || baseId);
			const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
			sch = new compile_1.SchemaEnv({
				schema,
				schemaId,
				meta,
				baseId,
				localRefs
			});
			this._cache.set(sch.schema, sch);
			if (addSchema && !baseId.startsWith("#")) {
				if (baseId) this._checkUnique(baseId);
				this.refs[baseId] = sch;
			}
			if (validateSchema) this.validateSchema(schema, true);
			return sch;
		}
		_checkUnique(id) {
			if (this.schemas[id] || this.refs[id]) throw new Error(`schema with key or id "${id}" already exists`);
		}
		_compileSchemaEnv(sch) {
			if (sch.meta) this._compileMetaSchema(sch);
			else compile_1.compileSchema.call(this, sch);
			/* istanbul ignore if */
			if (!sch.validate) throw new Error("ajv implementation error");
			return sch.validate;
		}
		_compileMetaSchema(sch) {
			const currentOpts = this.opts;
			this.opts = this._metaOpts;
			try {
				compile_1.compileSchema.call(this, sch);
			} finally {
				this.opts = currentOpts;
			}
		}
	};
	Ajv.ValidationError = validation_error_1.default;
	Ajv.MissingRefError = ref_error_1.default;
	exports.default = Ajv;
	function checkOptions(checkOpts, options, msg, log = "error") {
		for (const key in checkOpts) {
			const opt = key;
			if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
		}
	}
	function getSchEnv(keyRef) {
		keyRef = (0, resolve_1.normalizeId)(keyRef);
		return this.schemas[keyRef] || this.refs[keyRef];
	}
	function addInitialSchemas() {
		const optsSchemas = this.opts.schemas;
		if (!optsSchemas) return;
		if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas);
		else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key);
	}
	function addInitialFormats() {
		for (const name in this.opts.formats) {
			const format = this.opts.formats[name];
			if (format) this.addFormat(name, format);
		}
	}
	function addInitialKeywords(defs) {
		if (Array.isArray(defs)) {
			this.addVocabulary(defs);
			return;
		}
		this.logger.warn("keywords option as map is deprecated, pass array");
		for (const keyword in defs) {
			const def = defs[keyword];
			if (!def.keyword) def.keyword = keyword;
			this.addKeyword(def);
		}
	}
	function getMetaSchemaOptions() {
		const metaOpts = { ...this.opts };
		for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt];
		return metaOpts;
	}
	var noLogs = {
		log() {},
		warn() {},
		error() {}
	};
	function getLogger(logger) {
		if (logger === false) return noLogs;
		if (logger === void 0) return console;
		if (logger.log && logger.warn && logger.error) return logger;
		throw new Error("logger must implement log, warn and error methods");
	}
	var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
	function checkKeyword(keyword, def) {
		const { RULES } = this;
		(0, util_1.eachItem)(keyword, (kwd) => {
			if (RULES.keywords[kwd]) throw new Error(`Keyword ${kwd} is already defined`);
			if (!KEYWORD_NAME.test(kwd)) throw new Error(`Keyword ${kwd} has invalid name`);
		});
		if (!def) return;
		if (def.$data && !("code" in def || "validate" in def)) throw new Error("$data keyword must have \"code\" or \"validate\" function");
	}
	function addRule(keyword, definition, dataType) {
		var _a;
		const post = definition === null || definition === void 0 ? void 0 : definition.post;
		if (dataType && post) throw new Error("keyword with \"post\" flag cannot have \"type\"");
		const { RULES } = this;
		let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
		if (!ruleGroup) {
			ruleGroup = {
				type: dataType,
				rules: []
			};
			RULES.rules.push(ruleGroup);
		}
		RULES.keywords[keyword] = true;
		if (!definition) return;
		const rule = {
			keyword,
			definition: {
				...definition,
				type: (0, dataType_1.getJSONTypes)(definition.type),
				schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
			}
		};
		if (definition.before) addBeforeRule.call(this, ruleGroup, rule, definition.before);
		else ruleGroup.rules.push(rule);
		RULES.all[keyword] = rule;
		(_a = definition.implements) === null || _a === void 0 || _a.forEach((kwd) => this.addKeyword(kwd));
	}
	function addBeforeRule(ruleGroup, rule, before) {
		const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
		if (i >= 0) ruleGroup.rules.splice(i, 0, rule);
		else {
			ruleGroup.rules.push(rule);
			this.logger.warn(`rule ${before} is not defined`);
		}
	}
	function keywordMetaschema(def) {
		let { metaSchema } = def;
		if (metaSchema === void 0) return;
		if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema);
		def.validateSchema = this.compile(metaSchema, true);
	}
	var $dataRef = { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" };
	function schemaOrData(schema) {
		return { anyOf: [schema, $dataRef] };
	}
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/id.js
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "id",
		code() {
			throw new Error("NOT SUPPORTED: keyword \"id\", use \"$id\" for schema ID");
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.callRef = exports.getValidate = void 0;
	var ref_error_1 = require_ref_error();
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var compile_1 = require_compile();
	var util_1 = require_util();
	var def = {
		keyword: "$ref",
		schemaType: "string",
		code(cxt) {
			const { gen, schema: $ref, it } = cxt;
			const { baseId, schemaEnv: env, validateName, opts, self } = it;
			const { root } = env;
			if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef();
			const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
			if (schOrEnv === void 0) throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
			if (schOrEnv instanceof compile_1.SchemaEnv) return callValidate(schOrEnv);
			return inlineRefSchema(schOrEnv);
			function callRootRef() {
				if (env === root) return callRef(cxt, validateName, env, env.$async);
				const rootName = gen.scopeValue("root", { ref: root });
				return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
			}
			function callValidate(sch) {
				callRef(cxt, getValidate(cxt, sch), sch, sch.$async);
			}
			function inlineRefSchema(sch) {
				const schName = gen.scopeValue("schema", opts.code.source === true ? {
					ref: sch,
					code: (0, codegen_1.stringify)(sch)
				} : { ref: sch });
				const valid = gen.name("valid");
				const schCxt = cxt.subschema({
					schema: sch,
					dataTypes: [],
					schemaPath: codegen_1.nil,
					topSchemaRef: schName,
					errSchemaPath: $ref
				}, valid);
				cxt.mergeEvaluated(schCxt);
				cxt.ok(valid);
			}
		}
	};
	function getValidate(cxt, sch) {
		const { gen } = cxt;
		return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
	}
	exports.getValidate = getValidate;
	function callRef(cxt, v, sch, $async) {
		const { gen, it } = cxt;
		const { allErrors, schemaEnv: env, opts } = it;
		const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
		if ($async) callAsyncRef();
		else callSyncRef();
		function callAsyncRef() {
			if (!env.$async) throw new Error("async schema referenced by sync schema");
			const valid = gen.let("valid");
			gen.try(() => {
				gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
				addEvaluatedFrom(v);
				if (!allErrors) gen.assign(valid, true);
			}, (e) => {
				gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
				addErrorsFrom(e);
				if (!allErrors) gen.assign(valid, false);
			});
			cxt.ok(valid);
		}
		function callSyncRef() {
			cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
		}
		function addErrorsFrom(source) {
			const errs = (0, codegen_1._)`${source}.errors`;
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
			gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
		}
		function addEvaluatedFrom(source) {
			var _a;
			if (!it.opts.unevaluated) return;
			const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
			if (it.props !== true) {
				if (schEvaluated && !schEvaluated.dynamicProps) {
					if (schEvaluated.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
				} else {
					const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
					it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
				}
			}
			if (it.items !== true) {
				if (schEvaluated && !schEvaluated.dynamicItems) {
					if (schEvaluated.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
				} else {
					const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
					it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
				}
			}
		}
	}
	exports.callRef = callRef;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/core/index.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var id_1 = require_id();
	var ref_1 = require_ref();
	exports.default = [
		"$schema",
		"$id",
		"$defs",
		"$vocabulary",
		{ keyword: "$comment" },
		"definitions",
		id_1.default,
		ref_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		maximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		minimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		exclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		exclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.default = {
		keyword: Object.keys(KWDs),
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "multipleOf",
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
			params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, it } = cxt;
			const prec = it.opts.multipleOfPrecision;
			const res = gen.let("res");
			const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
			cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function ucs2length(str) {
		const len = str.length;
		let length = 0;
		let pos = 0;
		let value;
		while (pos < len) {
			length++;
			value = str.charCodeAt(pos++);
			if (value >= 55296 && value <= 56319 && pos < len) {
				value = str.charCodeAt(pos);
				if ((value & 64512) === 56320) pos++;
			}
		}
		return length;
	}
	exports.default = ucs2length;
	ucs2length.code = "require(\"ajv/dist/runtime/ucs2length\").default";
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var ucs2length_1 = require_ucs2length();
	exports.default = {
		keyword: ["maxLength", "minLength"],
		type: "string",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxLength" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode, it } = cxt;
			const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
			const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
			cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var util_1 = require_util();
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "pattern",
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const u = it.opts.unicodeRegExp ? "u" : "";
			if ($data) {
				const { regExp } = it.opts.code;
				const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
				const valid = gen.let("valid");
				gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
				cxt.fail$data((0, codegen_1._)`!${valid}`);
			} else {
				const regExp = (0, code_1.usePattern)(cxt, schema);
				cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxProperties", "minProperties"],
		type: "object",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxProperties" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "required",
		type: "object",
		schemaType: "array",
		$data: true,
		error: {
			message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
			params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
		},
		code(cxt) {
			const { gen, schema, schemaCode, data, $data, it } = cxt;
			const { opts } = it;
			if (!$data && schema.length === 0) return;
			const useLoop = schema.length >= opts.loopRequired;
			if (it.allErrors) allErrorsMode();
			else exitOnErrorMode();
			if (opts.strictRequired) {
				const props = cxt.parentSchema.properties;
				const { definedProperties } = cxt.it;
				for (const requiredKey of schema) if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
					const msg = `required property "${requiredKey}" is not defined at "${it.schemaEnv.baseId + it.errSchemaPath}" (strictRequired)`;
					(0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
				}
			}
			function allErrorsMode() {
				if (useLoop || $data) cxt.block$data(codegen_1.nil, loopAllRequired);
				else for (const prop of schema) (0, code_1.checkReportMissingProp)(cxt, prop);
			}
			function exitOnErrorMode() {
				const missing = gen.let("missing");
				if (useLoop || $data) {
					const valid = gen.let("valid", true);
					cxt.block$data(valid, () => loopUntilMissing(missing, valid));
					cxt.ok(valid);
				} else {
					gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
					(0, code_1.reportMissingProp)(cxt, missing);
					gen.else();
				}
			}
			function loopAllRequired() {
				gen.forOf("prop", schemaCode, (prop) => {
					cxt.setParams({ missingProperty: prop });
					gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
				});
			}
			function loopUntilMissing(missing, valid) {
				cxt.setParams({ missingProperty: missing });
				gen.forOf(missing, schemaCode, () => {
					gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
					gen.if((0, codegen_1.not)(valid), () => {
						cxt.error();
						gen.break();
					});
				}, codegen_1.nil);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxItems", "minItems"],
		type: "array",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxItems" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/runtime/equal.js
var require_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var equal = require_fast_deep_equal();
	equal.code = "require(\"ajv/dist/runtime/equal\").default";
	exports.default = equal;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dataType_1 = require_dataType();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "uniqueItems",
		type: "array",
		schemaType: "boolean",
		$data: true,
		error: {
			message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
			params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
			if (!$data && !schema) return;
			const valid = gen.let("valid");
			const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
			cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
			cxt.ok(valid);
			function validateUniqueItems() {
				const i = gen.let("i", (0, codegen_1._)`${data}.length`);
				const j = gen.let("j");
				cxt.setParams({
					i,
					j
				});
				gen.assign(valid, true);
				gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
			}
			function canOptimize() {
				return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
			}
			function loopN(i, j) {
				const item = gen.name("item");
				const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
				const indices = gen.const("indices", (0, codegen_1._)`{}`);
				gen.for((0, codegen_1._)`;${i}--;`, () => {
					gen.let(item, (0, codegen_1._)`${data}[${i}]`);
					gen.if(wrongType, (0, codegen_1._)`continue`);
					if (itemTypes.length > 1) gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
					gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
						gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
						cxt.error();
						gen.assign(valid, false).break();
					}).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
				});
			}
			function loopN2(i, j) {
				const eql = (0, util_1.useFunc)(gen, equal_1.default);
				const outer = gen.name("outer");
				gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
					cxt.error();
					gen.assign(valid, false).break(outer);
				})));
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "const",
		$data: true,
		error: {
			message: "must be equal to constant",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schemaCode, schema } = cxt;
			if ($data || schema && typeof schema == "object") cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
			else cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "enum",
		schemaType: "array",
		$data: true,
		error: {
			message: "must be equal to one of the allowed values",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			if (!$data && schema.length === 0) throw new Error("enum must have non-empty array");
			const useLoop = schema.length >= it.opts.loopEnum;
			let eql;
			const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
			let valid;
			if (useLoop || $data) {
				valid = gen.let("valid");
				cxt.block$data(valid, loopEnum);
			} else {
				/* istanbul ignore if */
				if (!Array.isArray(schema)) throw new Error("ajv implementation error");
				const vSchema = gen.const("vSchema", schemaCode);
				valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
			}
			cxt.pass(valid);
			function loopEnum() {
				gen.assign(valid, false);
				gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
			}
			function equalCode(vSchema, i) {
				const sch = schema[i];
				return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var limitNumber_1 = require_limitNumber();
	var multipleOf_1 = require_multipleOf();
	var limitLength_1 = require_limitLength();
	var pattern_1 = require_pattern();
	var limitProperties_1 = require_limitProperties();
	var required_1 = require_required();
	var limitItems_1 = require_limitItems();
	var uniqueItems_1 = require_uniqueItems();
	var const_1 = require_const();
	var enum_1 = require_enum();
	exports.default = [
		limitNumber_1.default,
		multipleOf_1.default,
		limitLength_1.default,
		pattern_1.default,
		limitProperties_1.default,
		required_1.default,
		limitItems_1.default,
		uniqueItems_1.default,
		{
			keyword: "type",
			schemaType: ["string", "array"]
		},
		{
			keyword: "nullable",
			schemaType: "boolean"
		},
		const_1.default,
		enum_1.default
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateAdditionalItems = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "additionalItems",
		type: "array",
		schemaType: ["boolean", "object"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { parentSchema, it } = cxt;
			const { items } = parentSchema;
			if (!Array.isArray(items)) {
				(0, util_1.checkStrictMode)(it, "\"additionalItems\" is ignored when \"items\" is not an array of schemas");
				return;
			}
			validateAdditionalItems(cxt, items);
		}
	};
	function validateAdditionalItems(cxt, items) {
		const { gen, schema, data, keyword, it } = cxt;
		it.items = true;
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		if (schema === false) {
			cxt.setParams({ len: items.length });
			cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
		} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
			const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
			gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
			cxt.ok(valid);
		}
		function validateItems(valid) {
			gen.forRange("i", items.length, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
			});
		}
	}
	exports.validateAdditionalItems = validateAdditionalItems;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateTuple = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var def = {
		keyword: "items",
		type: "array",
		schemaType: [
			"object",
			"array",
			"boolean"
		],
		before: "uniqueItems",
		code(cxt) {
			const { schema, it } = cxt;
			if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema);
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
	function validateTuple(cxt, extraItems, schArr = cxt.schema) {
		const { gen, parentSchema, data, keyword, it } = cxt;
		checkStrictTuple(parentSchema);
		if (it.opts.unevaluated && schArr.length && it.items !== true) it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
		const valid = gen.name("valid");
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		schArr.forEach((sch, i) => {
			if ((0, util_1.alwaysValidSchema)(it, sch)) return;
			gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
				keyword,
				schemaProp: i,
				dataProp: i
			}, valid));
			cxt.ok(valid);
		});
		function checkStrictTuple(sch) {
			const { opts, errSchemaPath } = it;
			const l = schArr.length;
			const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
			if (opts.strictTuples && !fullTuple) {
				const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
				(0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
			}
		}
	}
	exports.validateTuple = validateTuple;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var items_1 = require_items();
	exports.default = {
		keyword: "prefixItems",
		type: "array",
		schemaType: ["array"],
		before: "uniqueItems",
		code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var additionalItems_1 = require_additionalItems();
	exports.default = {
		keyword: "items",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { schema, parentSchema, it } = cxt;
			const { prefixItems } = parentSchema;
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			if (prefixItems) (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
			else cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "contains",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		trackErrors: true,
		error: {
			message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
			params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			let min;
			let max;
			const { minContains, maxContains } = parentSchema;
			if (it.opts.next) {
				min = minContains === void 0 ? 1 : minContains;
				max = maxContains;
			} else min = 1;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			cxt.setParams({
				min,
				max
			});
			if (max === void 0 && min === 0) {
				(0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
				return;
			}
			if (max !== void 0 && min > max) {
				(0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
				cxt.fail();
				return;
			}
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				let cond = (0, codegen_1._)`${len} >= ${min}`;
				if (max !== void 0) cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
				cxt.pass(cond);
				return;
			}
			it.items = true;
			const valid = gen.name("valid");
			if (max === void 0 && min === 1) validateItems(valid, () => gen.if(valid, () => gen.break()));
			else if (min === 0) {
				gen.let(valid, true);
				if (max !== void 0) gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
			} else {
				gen.let(valid, false);
				validateItemsWithCount();
			}
			cxt.result(valid, () => cxt.reset());
			function validateItemsWithCount() {
				const schValid = gen.name("_valid");
				const count = gen.let("count", 0);
				validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
			}
			function validateItems(_valid, block) {
				gen.forRange("i", 0, len, (i) => {
					cxt.subschema({
						keyword: "contains",
						dataProp: i,
						dataPropType: util_1.Type.Num,
						compositeRule: true
					}, _valid);
					block();
				});
			}
			function checkLimits(count) {
				gen.code((0, codegen_1._)`${count}++`);
				if (max === void 0) gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
				else {
					gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
					if (min === 1) gen.assign(valid, true);
					else gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	exports.error = {
		message: ({ params: { property, depsCount, deps } }) => {
			const property_ies = depsCount === 1 ? "property" : "properties";
			return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
		},
		params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
	};
	var def = {
		keyword: "dependencies",
		type: "object",
		schemaType: "object",
		error: exports.error,
		code(cxt) {
			const [propDeps, schDeps] = splitDependencies(cxt);
			validatePropertyDeps(cxt, propDeps);
			validateSchemaDeps(cxt, schDeps);
		}
	};
	function splitDependencies({ schema }) {
		const propertyDeps = {};
		const schemaDeps = {};
		for (const key in schema) {
			if (key === "__proto__") continue;
			const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
			deps[key] = schema[key];
		}
		return [propertyDeps, schemaDeps];
	}
	function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
		const { gen, data, it } = cxt;
		if (Object.keys(propertyDeps).length === 0) return;
		const missing = gen.let("missing");
		for (const prop in propertyDeps) {
			const deps = propertyDeps[prop];
			if (deps.length === 0) continue;
			const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
			cxt.setParams({
				property: prop,
				depsCount: deps.length,
				deps: deps.join(", ")
			});
			if (it.allErrors) gen.if(hasProperty, () => {
				for (const depProp of deps) (0, code_1.checkReportMissingProp)(cxt, depProp);
			});
			else {
				gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
				(0, code_1.reportMissingProp)(cxt, missing);
				gen.else();
			}
		}
	}
	exports.validatePropertyDeps = validatePropertyDeps;
	function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		for (const prop in schemaDeps) {
			if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue;
			gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
				const schCxt = cxt.subschema({
					keyword,
					schemaProp: prop
				}, valid);
				cxt.mergeValidEvaluated(schCxt, valid);
			}, () => gen.var(valid, true));
			cxt.ok(valid);
		}
	}
	exports.validateSchemaDeps = validateSchemaDeps;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "propertyNames",
		type: "object",
		schemaType: ["object", "boolean"],
		error: {
			message: "property name must be valid",
			params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			const valid = gen.name("valid");
			gen.forIn("key", data, (key) => {
				cxt.setParams({ propertyName: key });
				cxt.subschema({
					keyword: "propertyNames",
					data: key,
					dataTypes: ["string"],
					propertyName: key,
					compositeRule: true
				}, valid);
				gen.if((0, codegen_1.not)(valid), () => {
					cxt.error(true);
					if (!it.allErrors) gen.break();
				});
			});
			cxt.ok(valid);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var util_1 = require_util();
	exports.default = {
		keyword: "additionalProperties",
		type: ["object"],
		schemaType: ["boolean", "object"],
		allowUndefined: true,
		trackErrors: true,
		error: {
			message: "must NOT have additional properties",
			params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, opts } = it;
			it.props = true;
			if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema)) return;
			const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
			const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
			checkAdditionalProperties();
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function checkAdditionalProperties() {
				gen.forIn("key", data, (key) => {
					if (!props.length && !patProps.length) additionalPropertyCode(key);
					else gen.if(isAdditional(key), () => additionalPropertyCode(key));
				});
			}
			function isAdditional(key) {
				let definedProp;
				if (props.length > 8) {
					const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
					definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
				} else if (props.length) definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
				else definedProp = codegen_1.nil;
				if (patProps.length) definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
				return (0, codegen_1.not)(definedProp);
			}
			function deleteAdditional(key) {
				gen.code((0, codegen_1._)`delete ${data}[${key}]`);
			}
			function additionalPropertyCode(key) {
				if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
					deleteAdditional(key);
					return;
				}
				if (schema === false) {
					cxt.setParams({ additionalProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					if (opts.removeAdditional === "failing") {
						applyAdditionalSchema(key, valid, false);
						gen.if((0, codegen_1.not)(valid), () => {
							cxt.reset();
							deleteAdditional(key);
						});
					} else {
						applyAdditionalSchema(key, valid);
						if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					}
				}
			}
			function applyAdditionalSchema(key, valid, errors) {
				const subschema = {
					keyword: "additionalProperties",
					dataProp: key,
					dataPropType: util_1.Type.Str
				};
				if (errors === false) Object.assign(subschema, {
					compositeRule: true,
					createErrors: false,
					allErrors: false
				});
				cxt.subschema(subschema, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var validate_1 = require_validate();
	var code_1 = require_code();
	var util_1 = require_util();
	var additionalProperties_1 = require_additionalProperties();
	exports.default = {
		keyword: "properties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
			const allProps = (0, code_1.allSchemaProperties)(schema);
			for (const prop of allProps) it.definedProperties.add(prop);
			if (it.opts.unevaluated && allProps.length && it.props !== true) it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
			const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
			if (properties.length === 0) return;
			const valid = gen.name("valid");
			for (const prop of properties) {
				if (hasDefault(prop)) applyPropertySchema(prop);
				else {
					gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
					applyPropertySchema(prop);
					if (!it.allErrors) gen.else().var(valid, true);
					gen.endIf();
				}
				cxt.it.definedProperties.add(prop);
				cxt.ok(valid);
			}
			function hasDefault(prop) {
				return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
			}
			function applyPropertySchema(prop) {
				cxt.subschema({
					keyword: "properties",
					schemaProp: prop,
					dataProp: prop
				}, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var util_2 = require_util();
	exports.default = {
		keyword: "patternProperties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, data, parentSchema, it } = cxt;
			const { opts } = it;
			const patterns = (0, code_1.allSchemaProperties)(schema);
			const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
			if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) return;
			const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
			const valid = gen.name("valid");
			if (it.props !== true && !(it.props instanceof codegen_1.Name)) it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
			const { props } = it;
			validatePatternProperties();
			function validatePatternProperties() {
				for (const pat of patterns) {
					if (checkProperties) checkMatchingProperties(pat);
					if (it.allErrors) validateProperties(pat);
					else {
						gen.var(valid, true);
						validateProperties(pat);
						gen.if(valid);
					}
				}
			}
			function checkMatchingProperties(pat) {
				for (const prop in checkProperties) if (new RegExp(pat).test(prop)) (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
			}
			function validateProperties(pat) {
				gen.forIn("key", data, (key) => {
					gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
						const alwaysValid = alwaysValidPatterns.includes(pat);
						if (!alwaysValid) cxt.subschema({
							keyword: "patternProperties",
							schemaProp: pat,
							dataProp: key,
							dataPropType: util_2.Type.Str
						}, valid);
						if (it.opts.unevaluated && props !== true) gen.assign((0, codegen_1._)`${props}[${key}]`, true);
						else if (!alwaysValid && !it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "not",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		code(cxt) {
			const { gen, schema, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				cxt.fail();
				return;
			}
			const valid = gen.name("valid");
			cxt.subschema({
				keyword: "not",
				compositeRule: true,
				createErrors: false,
				allErrors: false
			}, valid);
			cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
		},
		error: { message: "must NOT be valid" }
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "anyOf",
		schemaType: "array",
		trackErrors: true,
		code: require_code().validateUnion,
		error: { message: "must match a schema in anyOf" }
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "oneOf",
		schemaType: "array",
		trackErrors: true,
		error: {
			message: "must match exactly one schema in oneOf",
			params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			if (it.opts.discriminator && parentSchema.discriminator) return;
			const schArr = schema;
			const valid = gen.let("valid", false);
			const passing = gen.let("passing", null);
			const schValid = gen.name("_valid");
			cxt.setParams({ passing });
			gen.block(validateOneOf);
			cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
			function validateOneOf() {
				schArr.forEach((sch, i) => {
					let schCxt;
					if ((0, util_1.alwaysValidSchema)(it, sch)) gen.var(schValid, true);
					else schCxt = cxt.subschema({
						keyword: "oneOf",
						schemaProp: i,
						compositeRule: true
					}, schValid);
					if (i > 0) gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
					gen.if(schValid, () => {
						gen.assign(valid, true);
						gen.assign(passing, i);
						if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name);
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "allOf",
		schemaType: "array",
		code(cxt) {
			const { gen, schema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			const valid = gen.name("valid");
			schema.forEach((sch, i) => {
				if ((0, util_1.alwaysValidSchema)(it, sch)) return;
				const schCxt = cxt.subschema({
					keyword: "allOf",
					schemaProp: i
				}, valid);
				cxt.ok(valid);
				cxt.mergeEvaluated(schCxt);
			});
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "if",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		error: {
			message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
			params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
		},
		code(cxt) {
			const { gen, parentSchema, it } = cxt;
			if (parentSchema.then === void 0 && parentSchema.else === void 0) (0, util_1.checkStrictMode)(it, "\"if\" without \"then\" and \"else\" is ignored");
			const hasThen = hasSchema(it, "then");
			const hasElse = hasSchema(it, "else");
			if (!hasThen && !hasElse) return;
			const valid = gen.let("valid", true);
			const schValid = gen.name("_valid");
			validateIf();
			cxt.reset();
			if (hasThen && hasElse) {
				const ifClause = gen.let("ifClause");
				cxt.setParams({ ifClause });
				gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
			} else if (hasThen) gen.if(schValid, validateClause("then"));
			else gen.if((0, codegen_1.not)(schValid), validateClause("else"));
			cxt.pass(valid, () => cxt.error(true));
			function validateIf() {
				const schCxt = cxt.subschema({
					keyword: "if",
					compositeRule: true,
					createErrors: false,
					allErrors: false
				}, schValid);
				cxt.mergeEvaluated(schCxt);
			}
			function validateClause(keyword, ifClause) {
				return () => {
					const schCxt = cxt.subschema({ keyword }, schValid);
					gen.assign(valid, schValid);
					cxt.mergeValidEvaluated(schCxt, valid);
					if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
					else cxt.setParams({ ifClause: keyword });
				};
			}
		}
	};
	function hasSchema(it, keyword) {
		const schema = it.schema[keyword];
		return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
	}
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: ["then", "else"],
		schemaType: ["object", "boolean"],
		code({ keyword, parentSchema, it }) {
			if (parentSchema.if === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var additionalItems_1 = require_additionalItems();
	var prefixItems_1 = require_prefixItems();
	var items_1 = require_items();
	var items2020_1 = require_items2020();
	var contains_1 = require_contains();
	var dependencies_1 = require_dependencies();
	var propertyNames_1 = require_propertyNames();
	var additionalProperties_1 = require_additionalProperties();
	var properties_1 = require_properties();
	var patternProperties_1 = require_patternProperties();
	var not_1 = require_not();
	var anyOf_1 = require_anyOf();
	var oneOf_1 = require_oneOf();
	var allOf_1 = require_allOf();
	var if_1 = require_if();
	var thenElse_1 = require_thenElse();
	function getApplicator(draft2020 = false) {
		const applicator = [
			not_1.default,
			anyOf_1.default,
			oneOf_1.default,
			allOf_1.default,
			if_1.default,
			thenElse_1.default,
			propertyNames_1.default,
			additionalProperties_1.default,
			dependencies_1.default,
			properties_1.default,
			patternProperties_1.default
		];
		if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
		else applicator.push(additionalItems_1.default, items_1.default);
		applicator.push(contains_1.default);
		return applicator;
	}
	exports.default = getApplicator;
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/format/format.js
var require_format$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "format",
		type: ["number", "string"],
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
		},
		code(cxt, ruleType) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const { opts, errSchemaPath, schemaEnv, self } = it;
			if (!opts.validateFormats) return;
			if ($data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
				const fType = gen.let("fType");
				const format = gen.let("format");
				gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
				cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
				function unknownFmt() {
					if (opts.strictSchema === false) return codegen_1.nil;
					return (0, codegen_1._)`${schemaCode} && !${format}`;
				}
				function invalidFmt() {
					const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
					const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
					return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
				}
			}
			function validateFormat() {
				const formatDef = self.formats[schema];
				if (!formatDef) {
					unknownFormat();
					return;
				}
				if (formatDef === true) return;
				const [fmtType, format, fmtRef] = getFormat(formatDef);
				if (fmtType === ruleType) cxt.pass(validCondition());
				function unknownFormat() {
					if (opts.strictSchema === false) {
						self.logger.warn(unknownMsg());
						return;
					}
					throw new Error(unknownMsg());
					function unknownMsg() {
						return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
					}
				}
				function getFormat(fmtDef) {
					const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
					const fmt = gen.scopeValue("formats", {
						key: schema,
						ref: fmtDef,
						code
					});
					if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) return [
						fmtDef.type || "string",
						fmtDef.validate,
						(0, codegen_1._)`${fmt}.validate`
					];
					return [
						"string",
						fmtDef,
						fmt
					];
				}
				function validCondition() {
					if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
						if (!schemaEnv.$async) throw new Error("async format in sync schema");
						return (0, codegen_1._)`await ${fmtRef}(${data})`;
					}
					return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/format/index.js
var require_format = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [require_format$1().default];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.contentVocabulary = exports.metadataVocabulary = void 0;
	exports.metadataVocabulary = [
		"title",
		"description",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly",
		"examples"
	];
	exports.contentVocabulary = [
		"contentMediaType",
		"contentEncoding",
		"contentSchema"
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core();
	var validation_1 = require_validation();
	var applicator_1 = require_applicator();
	var format_1 = require_format();
	var metadata_1 = require_metadata();
	exports.default = [
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary
	];
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiscrError = void 0;
	var DiscrError;
	(function(DiscrError) {
		DiscrError["Tag"] = "tag";
		DiscrError["Mapping"] = "mapping";
	})(DiscrError || (exports.DiscrError = DiscrError = {}));
}));
//#endregion
//#region node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var types_1 = require_types();
	var compile_1 = require_compile();
	var ref_error_1 = require_ref_error();
	var util_1 = require_util();
	exports.default = {
		keyword: "discriminator",
		type: "object",
		schemaType: "object",
		error: {
			message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
			params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
		},
		code(cxt) {
			const { gen, data, schema, parentSchema, it } = cxt;
			const { oneOf } = parentSchema;
			if (!it.opts.discriminator) throw new Error("discriminator: requires discriminator option");
			const tagName = schema.propertyName;
			if (typeof tagName != "string") throw new Error("discriminator: requires propertyName");
			if (schema.mapping) throw new Error("discriminator: mapping is not supported");
			if (!oneOf) throw new Error("discriminator: requires oneOf keyword");
			const valid = gen.let("valid", false);
			const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
			gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, {
				discrError: types_1.DiscrError.Tag,
				tag,
				tagName
			}));
			cxt.ok(valid);
			function validateMapping() {
				const mapping = getMapping();
				gen.if(false);
				for (const tagValue in mapping) {
					gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
					gen.assign(valid, applyTagSchema(mapping[tagValue]));
				}
				gen.else();
				cxt.error(false, {
					discrError: types_1.DiscrError.Mapping,
					tag,
					tagName
				});
				gen.endIf();
			}
			function applyTagSchema(schemaProp) {
				const _valid = gen.name("valid");
				const schCxt = cxt.subschema({
					keyword: "oneOf",
					schemaProp
				}, _valid);
				cxt.mergeEvaluated(schCxt, codegen_1.Name);
				return _valid;
			}
			function getMapping() {
				var _a;
				const oneOfMapping = {};
				const topRequired = hasRequired(parentSchema);
				let tagRequired = true;
				for (let i = 0; i < oneOf.length; i++) {
					let sch = oneOf[i];
					if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
						const ref = sch.$ref;
						sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
						if (sch instanceof compile_1.SchemaEnv) sch = sch.schema;
						if (sch === void 0) throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
					}
					const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
					if (typeof propSch != "object") throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
					tagRequired = tagRequired && (topRequired || hasRequired(sch));
					addMappings(propSch, i);
				}
				if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`);
				return oneOfMapping;
				function hasRequired({ required }) {
					return Array.isArray(required) && required.includes(tagName);
				}
				function addMappings(sch, i) {
					if (sch.const) addMapping(sch.const, i);
					else if (sch.enum) for (const tagValue of sch.enum) addMapping(tagValue, i);
					else throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
				}
				function addMapping(tagValue, i) {
					if (typeof tagValue != "string" || tagValue in oneOfMapping) throw new Error(`discriminator: "${tagName}" values must be unique strings`);
					oneOfMapping[tagValue] = i;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv/dist/refs/json-schema-draft-07.json
var json_schema_draft_07_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id,
	$schema: () => $schema,
	default: () => json_schema_draft_07_default,
	definitions: () => definitions,
	properties: () => properties,
	title: () => title,
	type: () => type
});
var $schema, $id, title, definitions, type, properties, json_schema_draft_07_default;
var init_json_schema_draft_07 = __esmMin((() => {
	$schema = "http://json-schema.org/draft-07/schema#";
	$id = "http://json-schema.org/draft-07/schema#";
	title = "Core schema meta-schema";
	definitions = {
		"schemaArray": {
			"type": "array",
			"minItems": 1,
			"items": { "$ref": "#" }
		},
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	type = ["object", "boolean"];
	properties = {
		"$id": {
			"type": "string",
			"format": "uri-reference"
		},
		"$schema": {
			"type": "string",
			"format": "uri"
		},
		"$ref": {
			"type": "string",
			"format": "uri-reference"
		},
		"$comment": { "type": "string" },
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
		"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"additionalItems": { "$ref": "#" },
		"items": {
			"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
			"default": true
		},
		"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
		"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"contains": { "$ref": "#" },
		"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
		"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/definitions/stringArray" },
		"additionalProperties": { "$ref": "#" },
		"definitions": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"properties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependencies": {
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
		},
		"propertyNames": { "$ref": "#" },
		"const": true,
		"enum": {
			"type": "array",
			"items": true,
			"minItems": 1,
			"uniqueItems": true
		},
		"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/definitions/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"format": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentEncoding": { "type": "string" },
		"if": { "$ref": "#" },
		"then": { "$ref": "#" },
		"else": { "$ref": "#" },
		"allOf": { "$ref": "#/definitions/schemaArray" },
		"anyOf": { "$ref": "#/definitions/schemaArray" },
		"oneOf": { "$ref": "#/definitions/schemaArray" },
		"not": { "$ref": "#" }
	};
	json_schema_draft_07_default = {
		$schema,
		$id,
		title,
		definitions,
		type,
		properties,
		"default": true
	};
}));
//#endregion
//#region node_modules/ajv/dist/ajv.js
var require_ajv = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
	var core_1 = require_core$1();
	var draft7_1 = require_draft7();
	var discriminator_1 = require_discriminator();
	var draft7MetaSchema = (init_json_schema_draft_07(), __toCommonJS(json_schema_draft_07_exports).default);
	var META_SUPPORT_DATA = ["/properties"];
	var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
	var Ajv = class extends core_1.default {
		_addVocabularies() {
			super._addVocabularies();
			draft7_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			if (!this.opts.meta) return;
			const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
			this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv = Ajv;
	module.exports = exports = Ajv;
	module.exports.Ajv = Ajv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
//#endregion
//#region node_modules/bn.js/lib/bn.js
var require_bn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(module$1, exports$1) {
		"use strict";
		function assert(val, msg) {
			if (!val) throw new Error(msg || "Assertion failed");
		}
		function inherits(ctor, superCtor) {
			ctor.super_ = superCtor;
			var TempCtor = function() {};
			TempCtor.prototype = superCtor.prototype;
			ctor.prototype = new TempCtor();
			ctor.prototype.constructor = ctor;
		}
		function BN(number, base, endian) {
			if (BN.isBN(number)) return number;
			this.negative = 0;
			this.words = null;
			this.length = 0;
			this.red = null;
			if (number !== null) {
				if (base === "le" || base === "be") {
					endian = base;
					base = 10;
				}
				this._init(number || 0, base || 10, endian || "be");
			}
		}
		if (typeof module$1 === "object") module$1.exports = BN;
		else exports$1.BN = BN;
		BN.BN = BN;
		BN.wordSize = 26;
		var Buffer;
		try {
			if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") Buffer = window.Buffer;
			else Buffer = __require("buffer").Buffer;
		} catch (e) {}
		BN.isBN = function isBN(num) {
			if (num instanceof BN) return true;
			return num !== null && typeof num === "object" && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
		};
		BN.max = function max(left, right) {
			if (left.cmp(right) > 0) return left;
			return right;
		};
		BN.min = function min(left, right) {
			if (left.cmp(right) < 0) return left;
			return right;
		};
		BN.prototype._init = function init(number, base, endian) {
			if (typeof number === "number") return this._initNumber(number, base, endian);
			if (typeof number === "object") return this._initArray(number, base, endian);
			if (base === "hex") base = 16;
			assert(base === (base | 0) && base >= 2 && base <= 36);
			number = number.toString().replace(/\s+/g, "");
			var start = 0;
			if (number[0] === "-") {
				start++;
				this.negative = 1;
			}
			if (start < number.length) {
				if (base === 16) this._parseHex(number, start, endian);
				else {
					this._parseBase(number, base, start);
					if (endian === "le") this._initArray(this.toArray(), base, endian);
				}
			}
		};
		BN.prototype._initNumber = function _initNumber(number, base, endian) {
			if (number < 0) {
				this.negative = 1;
				number = -number;
			}
			if (number < 67108864) {
				this.words = [number & 67108863];
				this.length = 1;
			} else if (number < 4503599627370496) {
				this.words = [number & 67108863, number / 67108864 & 67108863];
				this.length = 2;
			} else {
				assert(number < 9007199254740992);
				this.words = [
					number & 67108863,
					number / 67108864 & 67108863,
					1
				];
				this.length = 3;
			}
			if (endian !== "le") return;
			this._initArray(this.toArray(), base, endian);
		};
		BN.prototype._initArray = function _initArray(number, base, endian) {
			assert(typeof number.length === "number");
			if (number.length <= 0) {
				this.words = [0];
				this.length = 1;
				return this;
			}
			this.length = Math.ceil(number.length / 3);
			this.words = new Array(this.length);
			for (var i = 0; i < this.length; i++) this.words[i] = 0;
			var j, w;
			var off = 0;
			if (endian === "be") for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
				w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
				this.words[j] |= w << off & 67108863;
				this.words[j + 1] = w >>> 26 - off & 67108863;
				off += 24;
				if (off >= 26) {
					off -= 26;
					j++;
				}
			}
			else if (endian === "le") for (i = 0, j = 0; i < number.length; i += 3) {
				w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
				this.words[j] |= w << off & 67108863;
				this.words[j + 1] = w >>> 26 - off & 67108863;
				off += 24;
				if (off >= 26) {
					off -= 26;
					j++;
				}
			}
			return this._strip();
		};
		function parseHex4Bits(string, index) {
			var c = string.charCodeAt(index);
			if (c >= 48 && c <= 57) return c - 48;
			else if (c >= 65 && c <= 70) return c - 55;
			else if (c >= 97 && c <= 102) return c - 87;
			else assert(false, "Invalid character in " + string);
		}
		function parseHexByte(string, lowerBound, index) {
			var r = parseHex4Bits(string, index);
			if (index - 1 >= lowerBound) r |= parseHex4Bits(string, index - 1) << 4;
			return r;
		}
		BN.prototype._parseHex = function _parseHex(number, start, endian) {
			this.length = Math.ceil((number.length - start) / 6);
			this.words = new Array(this.length);
			for (var i = 0; i < this.length; i++) this.words[i] = 0;
			var off = 0;
			var j = 0;
			var w;
			if (endian === "be") for (i = number.length - 1; i >= start; i -= 2) {
				w = parseHexByte(number, start, i) << off;
				this.words[j] |= w & 67108863;
				if (off >= 18) {
					off -= 18;
					j += 1;
					this.words[j] |= w >>> 26;
				} else off += 8;
			}
			else for (i = (number.length - start) % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
				w = parseHexByte(number, start, i) << off;
				this.words[j] |= w & 67108863;
				if (off >= 18) {
					off -= 18;
					j += 1;
					this.words[j] |= w >>> 26;
				} else off += 8;
			}
			this._strip();
		};
		function parseBase(str, start, end, mul) {
			var r = 0;
			var b = 0;
			var len = Math.min(str.length, end);
			for (var i = start; i < len; i++) {
				var c = str.charCodeAt(i) - 48;
				r *= mul;
				if (c >= 49) b = c - 49 + 10;
				else if (c >= 17) b = c - 17 + 10;
				else b = c;
				assert(c >= 0 && b < mul, "Invalid character");
				r += b;
			}
			return r;
		}
		BN.prototype._parseBase = function _parseBase(number, base, start) {
			this.words = [0];
			this.length = 1;
			for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base) limbLen++;
			limbLen--;
			limbPow = limbPow / base | 0;
			var total = number.length - start;
			var mod = total % limbLen;
			var end = Math.min(total, total - mod) + start;
			var word = 0;
			for (var i = start; i < end; i += limbLen) {
				word = parseBase(number, i, i + limbLen, base);
				this.imuln(limbPow);
				if (this.words[0] + word < 67108864) this.words[0] += word;
				else this._iaddn(word);
			}
			if (mod !== 0) {
				var pow = 1;
				word = parseBase(number, i, number.length, base);
				for (i = 0; i < mod; i++) pow *= base;
				this.imuln(pow);
				if (this.words[0] + word < 67108864) this.words[0] += word;
				else this._iaddn(word);
			}
			this._strip();
		};
		BN.prototype.copy = function copy(dest) {
			dest.words = new Array(this.length);
			for (var i = 0; i < this.length; i++) dest.words[i] = this.words[i];
			dest.length = this.length;
			dest.negative = this.negative;
			dest.red = this.red;
		};
		function move(dest, src) {
			dest.words = src.words;
			dest.length = src.length;
			dest.negative = src.negative;
			dest.red = src.red;
		}
		BN.prototype._move = function _move(dest) {
			move(dest, this);
		};
		BN.prototype.clone = function clone() {
			var r = new BN(null);
			this.copy(r);
			return r;
		};
		BN.prototype._expand = function _expand(size) {
			while (this.length < size) this.words[this.length++] = 0;
			return this;
		};
		BN.prototype._strip = function strip() {
			while (this.length > 1 && this.words[this.length - 1] === 0) this.length--;
			return this._normSign();
		};
		BN.prototype._normSign = function _normSign() {
			if (this.length === 1 && this.words[0] === 0) this.negative = 0;
			return this;
		};
		if (typeof Symbol !== "undefined" && typeof Symbol.for === "function") try {
			BN.prototype[Symbol.for("nodejs.util.inspect.custom")] = inspect;
		} catch (e) {
			BN.prototype.inspect = inspect;
		}
		else BN.prototype.inspect = inspect;
		function inspect() {
			return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
		}
		var zeros = [
			"",
			"0",
			"00",
			"000",
			"0000",
			"00000",
			"000000",
			"0000000",
			"00000000",
			"000000000",
			"0000000000",
			"00000000000",
			"000000000000",
			"0000000000000",
			"00000000000000",
			"000000000000000",
			"0000000000000000",
			"00000000000000000",
			"000000000000000000",
			"0000000000000000000",
			"00000000000000000000",
			"000000000000000000000",
			"0000000000000000000000",
			"00000000000000000000000",
			"000000000000000000000000",
			"0000000000000000000000000"
		];
		var groupSizes = [
			0,
			0,
			25,
			16,
			12,
			11,
			10,
			9,
			8,
			8,
			7,
			7,
			7,
			7,
			6,
			6,
			6,
			6,
			6,
			6,
			6,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5
		];
		var groupBases = [
			0,
			0,
			33554432,
			43046721,
			16777216,
			48828125,
			60466176,
			40353607,
			16777216,
			43046721,
			1e7,
			19487171,
			35831808,
			62748517,
			7529536,
			11390625,
			16777216,
			24137569,
			34012224,
			47045881,
			64e6,
			4084101,
			5153632,
			6436343,
			7962624,
			9765625,
			11881376,
			14348907,
			17210368,
			20511149,
			243e5,
			28629151,
			33554432,
			39135393,
			45435424,
			52521875,
			60466176
		];
		BN.prototype.toString = function toString(base, padding) {
			base = base || 10;
			padding = padding | 0 || 1;
			var out;
			if (base === 16 || base === "hex") {
				out = "";
				var off = 0;
				var carry = 0;
				for (var i = 0; i < this.length; i++) {
					var w = this.words[i];
					var word = ((w << off | carry) & 16777215).toString(16);
					carry = w >>> 24 - off & 16777215;
					off += 2;
					if (off >= 26) {
						off -= 26;
						i--;
					}
					if (carry !== 0 || i !== this.length - 1) out = zeros[6 - word.length] + word + out;
					else out = word + out;
				}
				if (carry !== 0) out = carry.toString(16) + out;
				while (out.length % padding !== 0) out = "0" + out;
				if (this.negative !== 0) out = "-" + out;
				return out;
			}
			if (base === (base | 0) && base >= 2 && base <= 36) {
				var groupSize = groupSizes[base];
				var groupBase = groupBases[base];
				out = "";
				var c = this.clone();
				c.negative = 0;
				while (!c.isZero()) {
					var r = c.modrn(groupBase).toString(base);
					c = c.idivn(groupBase);
					if (!c.isZero()) out = zeros[groupSize - r.length] + r + out;
					else out = r + out;
				}
				if (this.isZero()) out = "0" + out;
				while (out.length % padding !== 0) out = "0" + out;
				if (this.negative !== 0) out = "-" + out;
				return out;
			}
			assert(false, "Base should be between 2 and 36");
		};
		BN.prototype.toNumber = function toNumber() {
			var ret = this.words[0];
			if (this.length === 2) ret += this.words[1] * 67108864;
			else if (this.length === 3 && this.words[2] === 1) ret += 4503599627370496 + this.words[1] * 67108864;
			else if (this.length > 2) assert(false, "Number can only safely store up to 53 bits");
			return this.negative !== 0 ? -ret : ret;
		};
		BN.prototype.toJSON = function toJSON() {
			return this.toString(16, 2);
		};
		if (Buffer) BN.prototype.toBuffer = function toBuffer(endian, length) {
			return this.toArrayLike(Buffer, endian, length);
		};
		BN.prototype.toArray = function toArray(endian, length) {
			return this.toArrayLike(Array, endian, length);
		};
		var allocate = function allocate(ArrayType, size) {
			if (ArrayType.allocUnsafe) return ArrayType.allocUnsafe(size);
			return new ArrayType(size);
		};
		BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
			this._strip();
			var byteLength = this.byteLength();
			var reqLength = length || Math.max(1, byteLength);
			assert(byteLength <= reqLength, "byte array longer than desired length");
			assert(reqLength > 0, "Requested array length <= 0");
			var res = allocate(ArrayType, reqLength);
			var postfix = endian === "le" ? "LE" : "BE";
			this["_toArrayLike" + postfix](res, byteLength);
			return res;
		};
		BN.prototype._toArrayLikeLE = function _toArrayLikeLE(res, byteLength) {
			var position = 0;
			var carry = 0;
			for (var i = 0, shift = 0; i < this.length; i++) {
				var word = this.words[i] << shift | carry;
				res[position++] = word & 255;
				if (position < res.length) res[position++] = word >> 8 & 255;
				if (position < res.length) res[position++] = word >> 16 & 255;
				if (shift === 6) {
					if (position < res.length) res[position++] = word >> 24 & 255;
					carry = 0;
					shift = 0;
				} else {
					carry = word >>> 24;
					shift += 2;
				}
			}
			if (position < res.length) {
				res[position++] = carry;
				while (position < res.length) res[position++] = 0;
			}
		};
		BN.prototype._toArrayLikeBE = function _toArrayLikeBE(res, byteLength) {
			var position = res.length - 1;
			var carry = 0;
			for (var i = 0, shift = 0; i < this.length; i++) {
				var word = this.words[i] << shift | carry;
				res[position--] = word & 255;
				if (position >= 0) res[position--] = word >> 8 & 255;
				if (position >= 0) res[position--] = word >> 16 & 255;
				if (shift === 6) {
					if (position >= 0) res[position--] = word >> 24 & 255;
					carry = 0;
					shift = 0;
				} else {
					carry = word >>> 24;
					shift += 2;
				}
			}
			if (position >= 0) {
				res[position--] = carry;
				while (position >= 0) res[position--] = 0;
			}
		};
		if (Math.clz32) BN.prototype._countBits = function _countBits(w) {
			return 32 - Math.clz32(w);
		};
		else BN.prototype._countBits = function _countBits(w) {
			var t = w;
			var r = 0;
			if (t >= 4096) {
				r += 13;
				t >>>= 13;
			}
			if (t >= 64) {
				r += 7;
				t >>>= 7;
			}
			if (t >= 8) {
				r += 4;
				t >>>= 4;
			}
			if (t >= 2) {
				r += 2;
				t >>>= 2;
			}
			return r + t;
		};
		BN.prototype._zeroBits = function _zeroBits(w) {
			if (w === 0) return 26;
			var t = w;
			var r = 0;
			if ((t & 8191) === 0) {
				r += 13;
				t >>>= 13;
			}
			if ((t & 127) === 0) {
				r += 7;
				t >>>= 7;
			}
			if ((t & 15) === 0) {
				r += 4;
				t >>>= 4;
			}
			if ((t & 3) === 0) {
				r += 2;
				t >>>= 2;
			}
			if ((t & 1) === 0) r++;
			return r;
		};
		BN.prototype.bitLength = function bitLength() {
			var w = this.words[this.length - 1];
			var hi = this._countBits(w);
			return (this.length - 1) * 26 + hi;
		};
		function toBitArray(num) {
			var w = new Array(num.bitLength());
			for (var bit = 0; bit < w.length; bit++) {
				var off = bit / 26 | 0;
				var wbit = bit % 26;
				w[bit] = num.words[off] >>> wbit & 1;
			}
			return w;
		}
		BN.prototype.zeroBits = function zeroBits() {
			if (this.isZero()) return 0;
			var r = 0;
			for (var i = 0; i < this.length; i++) {
				var b = this._zeroBits(this.words[i]);
				r += b;
				if (b !== 26) break;
			}
			return r;
		};
		BN.prototype.byteLength = function byteLength() {
			return Math.ceil(this.bitLength() / 8);
		};
		BN.prototype.toTwos = function toTwos(width) {
			if (this.negative !== 0) return this.abs().inotn(width).iaddn(1);
			return this.clone();
		};
		BN.prototype.fromTwos = function fromTwos(width) {
			if (this.testn(width - 1)) return this.notn(width).iaddn(1).ineg();
			return this.clone();
		};
		BN.prototype.isNeg = function isNeg() {
			return this.negative !== 0;
		};
		BN.prototype.neg = function neg() {
			return this.clone().ineg();
		};
		BN.prototype.ineg = function ineg() {
			if (!this.isZero()) this.negative ^= 1;
			return this;
		};
		BN.prototype.iuor = function iuor(num) {
			while (this.length < num.length) this.words[this.length++] = 0;
			for (var i = 0; i < num.length; i++) this.words[i] = this.words[i] | num.words[i];
			return this._strip();
		};
		BN.prototype.ior = function ior(num) {
			assert((this.negative | num.negative) === 0);
			return this.iuor(num);
		};
		BN.prototype.or = function or(num) {
			if (this.length > num.length) return this.clone().ior(num);
			return num.clone().ior(this);
		};
		BN.prototype.uor = function uor(num) {
			if (this.length > num.length) return this.clone().iuor(num);
			return num.clone().iuor(this);
		};
		BN.prototype.iuand = function iuand(num) {
			var b;
			if (this.length > num.length) b = num;
			else b = this;
			for (var i = 0; i < b.length; i++) this.words[i] = this.words[i] & num.words[i];
			this.length = b.length;
			return this._strip();
		};
		BN.prototype.iand = function iand(num) {
			assert((this.negative | num.negative) === 0);
			return this.iuand(num);
		};
		BN.prototype.and = function and(num) {
			if (this.length > num.length) return this.clone().iand(num);
			return num.clone().iand(this);
		};
		BN.prototype.uand = function uand(num) {
			if (this.length > num.length) return this.clone().iuand(num);
			return num.clone().iuand(this);
		};
		BN.prototype.iuxor = function iuxor(num) {
			var a;
			var b;
			if (this.length > num.length) {
				a = this;
				b = num;
			} else {
				a = num;
				b = this;
			}
			for (var i = 0; i < b.length; i++) this.words[i] = a.words[i] ^ b.words[i];
			if (this !== a) for (; i < a.length; i++) this.words[i] = a.words[i];
			this.length = a.length;
			return this._strip();
		};
		BN.prototype.ixor = function ixor(num) {
			assert((this.negative | num.negative) === 0);
			return this.iuxor(num);
		};
		BN.prototype.xor = function xor(num) {
			if (this.length > num.length) return this.clone().ixor(num);
			return num.clone().ixor(this);
		};
		BN.prototype.uxor = function uxor(num) {
			if (this.length > num.length) return this.clone().iuxor(num);
			return num.clone().iuxor(this);
		};
		BN.prototype.inotn = function inotn(width) {
			assert(typeof width === "number" && width >= 0);
			var bytesNeeded = Math.ceil(width / 26) | 0;
			var bitsLeft = width % 26;
			this._expand(bytesNeeded);
			if (bitsLeft > 0) bytesNeeded--;
			for (var i = 0; i < bytesNeeded; i++) this.words[i] = ~this.words[i] & 67108863;
			if (bitsLeft > 0) {
				this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft;
				i++;
			}
			for (; i < this.length; i++) this.words[i] = 0;
			return this._strip();
		};
		BN.prototype.notn = function notn(width) {
			return this.clone().inotn(width);
		};
		BN.prototype.setn = function setn(bit, val) {
			assert(typeof bit === "number" && bit >= 0);
			var off = bit / 26 | 0;
			var wbit = bit % 26;
			this._expand(off + 1);
			if (val) this.words[off] = this.words[off] | 1 << wbit;
			else this.words[off] = this.words[off] & ~(1 << wbit);
			return this._strip();
		};
		BN.prototype.iadd = function iadd(num) {
			var r;
			if (this.negative !== 0 && num.negative === 0) {
				this.negative = 0;
				r = this.isub(num);
				this.negative ^= 1;
				return this._normSign();
			} else if (this.negative === 0 && num.negative !== 0) {
				num.negative = 0;
				r = this.isub(num);
				num.negative = 1;
				return r._normSign();
			}
			var a, b;
			if (this.length > num.length) {
				a = this;
				b = num;
			} else {
				a = num;
				b = this;
			}
			var carry = 0;
			for (var i = 0; i < b.length; i++) {
				r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
				this.words[i] = r & 67108863;
				carry = r >>> 26;
			}
			for (; carry !== 0 && i < a.length; i++) {
				r = (a.words[i] | 0) + carry;
				this.words[i] = r & 67108863;
				carry = r >>> 26;
			}
			this.length = a.length;
			if (carry !== 0) {
				this.words[this.length] = carry;
				this.length++;
			} else if (a !== this) for (; i < a.length; i++) this.words[i] = a.words[i];
			return this;
		};
		BN.prototype.add = function add(num) {
			var res;
			if (num.negative !== 0 && this.negative === 0) {
				num.negative = 0;
				res = this.sub(num);
				num.negative ^= 1;
				return res;
			} else if (num.negative === 0 && this.negative !== 0) {
				this.negative = 0;
				res = num.sub(this);
				this.negative = 1;
				return res;
			}
			if (this.length > num.length) return this.clone().iadd(num);
			return num.clone().iadd(this);
		};
		BN.prototype.isub = function isub(num) {
			if (num.negative !== 0) {
				num.negative = 0;
				var r = this.iadd(num);
				num.negative = 1;
				return r._normSign();
			} else if (this.negative !== 0) {
				this.negative = 0;
				this.iadd(num);
				this.negative = 1;
				return this._normSign();
			}
			var cmp = this.cmp(num);
			if (cmp === 0) {
				this.negative = 0;
				this.length = 1;
				this.words[0] = 0;
				return this;
			}
			var a, b;
			if (cmp > 0) {
				a = this;
				b = num;
			} else {
				a = num;
				b = this;
			}
			var carry = 0;
			for (var i = 0; i < b.length; i++) {
				r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
				carry = r >> 26;
				this.words[i] = r & 67108863;
			}
			for (; carry !== 0 && i < a.length; i++) {
				r = (a.words[i] | 0) + carry;
				carry = r >> 26;
				this.words[i] = r & 67108863;
			}
			if (carry === 0 && i < a.length && a !== this) for (; i < a.length; i++) this.words[i] = a.words[i];
			this.length = Math.max(this.length, i);
			if (a !== this) this.negative = 1;
			return this._strip();
		};
		BN.prototype.sub = function sub(num) {
			return this.clone().isub(num);
		};
		function smallMulTo(self, num, out) {
			out.negative = num.negative ^ self.negative;
			var len = self.length + num.length | 0;
			out.length = len;
			len = len - 1 | 0;
			var a = self.words[0] | 0;
			var b = num.words[0] | 0;
			var r = a * b;
			var lo = r & 67108863;
			var carry = r / 67108864 | 0;
			out.words[0] = lo;
			for (var k = 1; k < len; k++) {
				var ncarry = carry >>> 26;
				var rword = carry & 67108863;
				var maxJ = Math.min(k, num.length - 1);
				for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
					var i = k - j | 0;
					a = self.words[i] | 0;
					b = num.words[j] | 0;
					r = a * b + rword;
					ncarry += r / 67108864 | 0;
					rword = r & 67108863;
				}
				out.words[k] = rword | 0;
				carry = ncarry | 0;
			}
			if (carry !== 0) out.words[k] = carry | 0;
			else out.length--;
			return out._strip();
		}
		var comb10MulTo = function comb10MulTo(self, num, out) {
			var a = self.words;
			var b = num.words;
			var o = out.words;
			var c = 0;
			var lo;
			var mid;
			var hi;
			var a0 = a[0] | 0;
			var al0 = a0 & 8191;
			var ah0 = a0 >>> 13;
			var a1 = a[1] | 0;
			var al1 = a1 & 8191;
			var ah1 = a1 >>> 13;
			var a2 = a[2] | 0;
			var al2 = a2 & 8191;
			var ah2 = a2 >>> 13;
			var a3 = a[3] | 0;
			var al3 = a3 & 8191;
			var ah3 = a3 >>> 13;
			var a4 = a[4] | 0;
			var al4 = a4 & 8191;
			var ah4 = a4 >>> 13;
			var a5 = a[5] | 0;
			var al5 = a5 & 8191;
			var ah5 = a5 >>> 13;
			var a6 = a[6] | 0;
			var al6 = a6 & 8191;
			var ah6 = a6 >>> 13;
			var a7 = a[7] | 0;
			var al7 = a7 & 8191;
			var ah7 = a7 >>> 13;
			var a8 = a[8] | 0;
			var al8 = a8 & 8191;
			var ah8 = a8 >>> 13;
			var a9 = a[9] | 0;
			var al9 = a9 & 8191;
			var ah9 = a9 >>> 13;
			var b0 = b[0] | 0;
			var bl0 = b0 & 8191;
			var bh0 = b0 >>> 13;
			var b1 = b[1] | 0;
			var bl1 = b1 & 8191;
			var bh1 = b1 >>> 13;
			var b2 = b[2] | 0;
			var bl2 = b2 & 8191;
			var bh2 = b2 >>> 13;
			var b3 = b[3] | 0;
			var bl3 = b3 & 8191;
			var bh3 = b3 >>> 13;
			var b4 = b[4] | 0;
			var bl4 = b4 & 8191;
			var bh4 = b4 >>> 13;
			var b5 = b[5] | 0;
			var bl5 = b5 & 8191;
			var bh5 = b5 >>> 13;
			var b6 = b[6] | 0;
			var bl6 = b6 & 8191;
			var bh6 = b6 >>> 13;
			var b7 = b[7] | 0;
			var bl7 = b7 & 8191;
			var bh7 = b7 >>> 13;
			var b8 = b[8] | 0;
			var bl8 = b8 & 8191;
			var bh8 = b8 >>> 13;
			var b9 = b[9] | 0;
			var bl9 = b9 & 8191;
			var bh9 = b9 >>> 13;
			out.negative = self.negative ^ num.negative;
			out.length = 19;
			lo = Math.imul(al0, bl0);
			mid = Math.imul(al0, bh0);
			mid = mid + Math.imul(ah0, bl0) | 0;
			hi = Math.imul(ah0, bh0);
			var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
			w0 &= 67108863;
			lo = Math.imul(al1, bl0);
			mid = Math.imul(al1, bh0);
			mid = mid + Math.imul(ah1, bl0) | 0;
			hi = Math.imul(ah1, bh0);
			lo = lo + Math.imul(al0, bl1) | 0;
			mid = mid + Math.imul(al0, bh1) | 0;
			mid = mid + Math.imul(ah0, bl1) | 0;
			hi = hi + Math.imul(ah0, bh1) | 0;
			var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
			w1 &= 67108863;
			lo = Math.imul(al2, bl0);
			mid = Math.imul(al2, bh0);
			mid = mid + Math.imul(ah2, bl0) | 0;
			hi = Math.imul(ah2, bh0);
			lo = lo + Math.imul(al1, bl1) | 0;
			mid = mid + Math.imul(al1, bh1) | 0;
			mid = mid + Math.imul(ah1, bl1) | 0;
			hi = hi + Math.imul(ah1, bh1) | 0;
			lo = lo + Math.imul(al0, bl2) | 0;
			mid = mid + Math.imul(al0, bh2) | 0;
			mid = mid + Math.imul(ah0, bl2) | 0;
			hi = hi + Math.imul(ah0, bh2) | 0;
			var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
			w2 &= 67108863;
			lo = Math.imul(al3, bl0);
			mid = Math.imul(al3, bh0);
			mid = mid + Math.imul(ah3, bl0) | 0;
			hi = Math.imul(ah3, bh0);
			lo = lo + Math.imul(al2, bl1) | 0;
			mid = mid + Math.imul(al2, bh1) | 0;
			mid = mid + Math.imul(ah2, bl1) | 0;
			hi = hi + Math.imul(ah2, bh1) | 0;
			lo = lo + Math.imul(al1, bl2) | 0;
			mid = mid + Math.imul(al1, bh2) | 0;
			mid = mid + Math.imul(ah1, bl2) | 0;
			hi = hi + Math.imul(ah1, bh2) | 0;
			lo = lo + Math.imul(al0, bl3) | 0;
			mid = mid + Math.imul(al0, bh3) | 0;
			mid = mid + Math.imul(ah0, bl3) | 0;
			hi = hi + Math.imul(ah0, bh3) | 0;
			var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
			w3 &= 67108863;
			lo = Math.imul(al4, bl0);
			mid = Math.imul(al4, bh0);
			mid = mid + Math.imul(ah4, bl0) | 0;
			hi = Math.imul(ah4, bh0);
			lo = lo + Math.imul(al3, bl1) | 0;
			mid = mid + Math.imul(al3, bh1) | 0;
			mid = mid + Math.imul(ah3, bl1) | 0;
			hi = hi + Math.imul(ah3, bh1) | 0;
			lo = lo + Math.imul(al2, bl2) | 0;
			mid = mid + Math.imul(al2, bh2) | 0;
			mid = mid + Math.imul(ah2, bl2) | 0;
			hi = hi + Math.imul(ah2, bh2) | 0;
			lo = lo + Math.imul(al1, bl3) | 0;
			mid = mid + Math.imul(al1, bh3) | 0;
			mid = mid + Math.imul(ah1, bl3) | 0;
			hi = hi + Math.imul(ah1, bh3) | 0;
			lo = lo + Math.imul(al0, bl4) | 0;
			mid = mid + Math.imul(al0, bh4) | 0;
			mid = mid + Math.imul(ah0, bl4) | 0;
			hi = hi + Math.imul(ah0, bh4) | 0;
			var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
			w4 &= 67108863;
			lo = Math.imul(al5, bl0);
			mid = Math.imul(al5, bh0);
			mid = mid + Math.imul(ah5, bl0) | 0;
			hi = Math.imul(ah5, bh0);
			lo = lo + Math.imul(al4, bl1) | 0;
			mid = mid + Math.imul(al4, bh1) | 0;
			mid = mid + Math.imul(ah4, bl1) | 0;
			hi = hi + Math.imul(ah4, bh1) | 0;
			lo = lo + Math.imul(al3, bl2) | 0;
			mid = mid + Math.imul(al3, bh2) | 0;
			mid = mid + Math.imul(ah3, bl2) | 0;
			hi = hi + Math.imul(ah3, bh2) | 0;
			lo = lo + Math.imul(al2, bl3) | 0;
			mid = mid + Math.imul(al2, bh3) | 0;
			mid = mid + Math.imul(ah2, bl3) | 0;
			hi = hi + Math.imul(ah2, bh3) | 0;
			lo = lo + Math.imul(al1, bl4) | 0;
			mid = mid + Math.imul(al1, bh4) | 0;
			mid = mid + Math.imul(ah1, bl4) | 0;
			hi = hi + Math.imul(ah1, bh4) | 0;
			lo = lo + Math.imul(al0, bl5) | 0;
			mid = mid + Math.imul(al0, bh5) | 0;
			mid = mid + Math.imul(ah0, bl5) | 0;
			hi = hi + Math.imul(ah0, bh5) | 0;
			var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
			w5 &= 67108863;
			lo = Math.imul(al6, bl0);
			mid = Math.imul(al6, bh0);
			mid = mid + Math.imul(ah6, bl0) | 0;
			hi = Math.imul(ah6, bh0);
			lo = lo + Math.imul(al5, bl1) | 0;
			mid = mid + Math.imul(al5, bh1) | 0;
			mid = mid + Math.imul(ah5, bl1) | 0;
			hi = hi + Math.imul(ah5, bh1) | 0;
			lo = lo + Math.imul(al4, bl2) | 0;
			mid = mid + Math.imul(al4, bh2) | 0;
			mid = mid + Math.imul(ah4, bl2) | 0;
			hi = hi + Math.imul(ah4, bh2) | 0;
			lo = lo + Math.imul(al3, bl3) | 0;
			mid = mid + Math.imul(al3, bh3) | 0;
			mid = mid + Math.imul(ah3, bl3) | 0;
			hi = hi + Math.imul(ah3, bh3) | 0;
			lo = lo + Math.imul(al2, bl4) | 0;
			mid = mid + Math.imul(al2, bh4) | 0;
			mid = mid + Math.imul(ah2, bl4) | 0;
			hi = hi + Math.imul(ah2, bh4) | 0;
			lo = lo + Math.imul(al1, bl5) | 0;
			mid = mid + Math.imul(al1, bh5) | 0;
			mid = mid + Math.imul(ah1, bl5) | 0;
			hi = hi + Math.imul(ah1, bh5) | 0;
			lo = lo + Math.imul(al0, bl6) | 0;
			mid = mid + Math.imul(al0, bh6) | 0;
			mid = mid + Math.imul(ah0, bl6) | 0;
			hi = hi + Math.imul(ah0, bh6) | 0;
			var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
			w6 &= 67108863;
			lo = Math.imul(al7, bl0);
			mid = Math.imul(al7, bh0);
			mid = mid + Math.imul(ah7, bl0) | 0;
			hi = Math.imul(ah7, bh0);
			lo = lo + Math.imul(al6, bl1) | 0;
			mid = mid + Math.imul(al6, bh1) | 0;
			mid = mid + Math.imul(ah6, bl1) | 0;
			hi = hi + Math.imul(ah6, bh1) | 0;
			lo = lo + Math.imul(al5, bl2) | 0;
			mid = mid + Math.imul(al5, bh2) | 0;
			mid = mid + Math.imul(ah5, bl2) | 0;
			hi = hi + Math.imul(ah5, bh2) | 0;
			lo = lo + Math.imul(al4, bl3) | 0;
			mid = mid + Math.imul(al4, bh3) | 0;
			mid = mid + Math.imul(ah4, bl3) | 0;
			hi = hi + Math.imul(ah4, bh3) | 0;
			lo = lo + Math.imul(al3, bl4) | 0;
			mid = mid + Math.imul(al3, bh4) | 0;
			mid = mid + Math.imul(ah3, bl4) | 0;
			hi = hi + Math.imul(ah3, bh4) | 0;
			lo = lo + Math.imul(al2, bl5) | 0;
			mid = mid + Math.imul(al2, bh5) | 0;
			mid = mid + Math.imul(ah2, bl5) | 0;
			hi = hi + Math.imul(ah2, bh5) | 0;
			lo = lo + Math.imul(al1, bl6) | 0;
			mid = mid + Math.imul(al1, bh6) | 0;
			mid = mid + Math.imul(ah1, bl6) | 0;
			hi = hi + Math.imul(ah1, bh6) | 0;
			lo = lo + Math.imul(al0, bl7) | 0;
			mid = mid + Math.imul(al0, bh7) | 0;
			mid = mid + Math.imul(ah0, bl7) | 0;
			hi = hi + Math.imul(ah0, bh7) | 0;
			var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
			w7 &= 67108863;
			lo = Math.imul(al8, bl0);
			mid = Math.imul(al8, bh0);
			mid = mid + Math.imul(ah8, bl0) | 0;
			hi = Math.imul(ah8, bh0);
			lo = lo + Math.imul(al7, bl1) | 0;
			mid = mid + Math.imul(al7, bh1) | 0;
			mid = mid + Math.imul(ah7, bl1) | 0;
			hi = hi + Math.imul(ah7, bh1) | 0;
			lo = lo + Math.imul(al6, bl2) | 0;
			mid = mid + Math.imul(al6, bh2) | 0;
			mid = mid + Math.imul(ah6, bl2) | 0;
			hi = hi + Math.imul(ah6, bh2) | 0;
			lo = lo + Math.imul(al5, bl3) | 0;
			mid = mid + Math.imul(al5, bh3) | 0;
			mid = mid + Math.imul(ah5, bl3) | 0;
			hi = hi + Math.imul(ah5, bh3) | 0;
			lo = lo + Math.imul(al4, bl4) | 0;
			mid = mid + Math.imul(al4, bh4) | 0;
			mid = mid + Math.imul(ah4, bl4) | 0;
			hi = hi + Math.imul(ah4, bh4) | 0;
			lo = lo + Math.imul(al3, bl5) | 0;
			mid = mid + Math.imul(al3, bh5) | 0;
			mid = mid + Math.imul(ah3, bl5) | 0;
			hi = hi + Math.imul(ah3, bh5) | 0;
			lo = lo + Math.imul(al2, bl6) | 0;
			mid = mid + Math.imul(al2, bh6) | 0;
			mid = mid + Math.imul(ah2, bl6) | 0;
			hi = hi + Math.imul(ah2, bh6) | 0;
			lo = lo + Math.imul(al1, bl7) | 0;
			mid = mid + Math.imul(al1, bh7) | 0;
			mid = mid + Math.imul(ah1, bl7) | 0;
			hi = hi + Math.imul(ah1, bh7) | 0;
			lo = lo + Math.imul(al0, bl8) | 0;
			mid = mid + Math.imul(al0, bh8) | 0;
			mid = mid + Math.imul(ah0, bl8) | 0;
			hi = hi + Math.imul(ah0, bh8) | 0;
			var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
			w8 &= 67108863;
			lo = Math.imul(al9, bl0);
			mid = Math.imul(al9, bh0);
			mid = mid + Math.imul(ah9, bl0) | 0;
			hi = Math.imul(ah9, bh0);
			lo = lo + Math.imul(al8, bl1) | 0;
			mid = mid + Math.imul(al8, bh1) | 0;
			mid = mid + Math.imul(ah8, bl1) | 0;
			hi = hi + Math.imul(ah8, bh1) | 0;
			lo = lo + Math.imul(al7, bl2) | 0;
			mid = mid + Math.imul(al7, bh2) | 0;
			mid = mid + Math.imul(ah7, bl2) | 0;
			hi = hi + Math.imul(ah7, bh2) | 0;
			lo = lo + Math.imul(al6, bl3) | 0;
			mid = mid + Math.imul(al6, bh3) | 0;
			mid = mid + Math.imul(ah6, bl3) | 0;
			hi = hi + Math.imul(ah6, bh3) | 0;
			lo = lo + Math.imul(al5, bl4) | 0;
			mid = mid + Math.imul(al5, bh4) | 0;
			mid = mid + Math.imul(ah5, bl4) | 0;
			hi = hi + Math.imul(ah5, bh4) | 0;
			lo = lo + Math.imul(al4, bl5) | 0;
			mid = mid + Math.imul(al4, bh5) | 0;
			mid = mid + Math.imul(ah4, bl5) | 0;
			hi = hi + Math.imul(ah4, bh5) | 0;
			lo = lo + Math.imul(al3, bl6) | 0;
			mid = mid + Math.imul(al3, bh6) | 0;
			mid = mid + Math.imul(ah3, bl6) | 0;
			hi = hi + Math.imul(ah3, bh6) | 0;
			lo = lo + Math.imul(al2, bl7) | 0;
			mid = mid + Math.imul(al2, bh7) | 0;
			mid = mid + Math.imul(ah2, bl7) | 0;
			hi = hi + Math.imul(ah2, bh7) | 0;
			lo = lo + Math.imul(al1, bl8) | 0;
			mid = mid + Math.imul(al1, bh8) | 0;
			mid = mid + Math.imul(ah1, bl8) | 0;
			hi = hi + Math.imul(ah1, bh8) | 0;
			lo = lo + Math.imul(al0, bl9) | 0;
			mid = mid + Math.imul(al0, bh9) | 0;
			mid = mid + Math.imul(ah0, bl9) | 0;
			hi = hi + Math.imul(ah0, bh9) | 0;
			var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
			w9 &= 67108863;
			lo = Math.imul(al9, bl1);
			mid = Math.imul(al9, bh1);
			mid = mid + Math.imul(ah9, bl1) | 0;
			hi = Math.imul(ah9, bh1);
			lo = lo + Math.imul(al8, bl2) | 0;
			mid = mid + Math.imul(al8, bh2) | 0;
			mid = mid + Math.imul(ah8, bl2) | 0;
			hi = hi + Math.imul(ah8, bh2) | 0;
			lo = lo + Math.imul(al7, bl3) | 0;
			mid = mid + Math.imul(al7, bh3) | 0;
			mid = mid + Math.imul(ah7, bl3) | 0;
			hi = hi + Math.imul(ah7, bh3) | 0;
			lo = lo + Math.imul(al6, bl4) | 0;
			mid = mid + Math.imul(al6, bh4) | 0;
			mid = mid + Math.imul(ah6, bl4) | 0;
			hi = hi + Math.imul(ah6, bh4) | 0;
			lo = lo + Math.imul(al5, bl5) | 0;
			mid = mid + Math.imul(al5, bh5) | 0;
			mid = mid + Math.imul(ah5, bl5) | 0;
			hi = hi + Math.imul(ah5, bh5) | 0;
			lo = lo + Math.imul(al4, bl6) | 0;
			mid = mid + Math.imul(al4, bh6) | 0;
			mid = mid + Math.imul(ah4, bl6) | 0;
			hi = hi + Math.imul(ah4, bh6) | 0;
			lo = lo + Math.imul(al3, bl7) | 0;
			mid = mid + Math.imul(al3, bh7) | 0;
			mid = mid + Math.imul(ah3, bl7) | 0;
			hi = hi + Math.imul(ah3, bh7) | 0;
			lo = lo + Math.imul(al2, bl8) | 0;
			mid = mid + Math.imul(al2, bh8) | 0;
			mid = mid + Math.imul(ah2, bl8) | 0;
			hi = hi + Math.imul(ah2, bh8) | 0;
			lo = lo + Math.imul(al1, bl9) | 0;
			mid = mid + Math.imul(al1, bh9) | 0;
			mid = mid + Math.imul(ah1, bl9) | 0;
			hi = hi + Math.imul(ah1, bh9) | 0;
			var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
			w10 &= 67108863;
			lo = Math.imul(al9, bl2);
			mid = Math.imul(al9, bh2);
			mid = mid + Math.imul(ah9, bl2) | 0;
			hi = Math.imul(ah9, bh2);
			lo = lo + Math.imul(al8, bl3) | 0;
			mid = mid + Math.imul(al8, bh3) | 0;
			mid = mid + Math.imul(ah8, bl3) | 0;
			hi = hi + Math.imul(ah8, bh3) | 0;
			lo = lo + Math.imul(al7, bl4) | 0;
			mid = mid + Math.imul(al7, bh4) | 0;
			mid = mid + Math.imul(ah7, bl4) | 0;
			hi = hi + Math.imul(ah7, bh4) | 0;
			lo = lo + Math.imul(al6, bl5) | 0;
			mid = mid + Math.imul(al6, bh5) | 0;
			mid = mid + Math.imul(ah6, bl5) | 0;
			hi = hi + Math.imul(ah6, bh5) | 0;
			lo = lo + Math.imul(al5, bl6) | 0;
			mid = mid + Math.imul(al5, bh6) | 0;
			mid = mid + Math.imul(ah5, bl6) | 0;
			hi = hi + Math.imul(ah5, bh6) | 0;
			lo = lo + Math.imul(al4, bl7) | 0;
			mid = mid + Math.imul(al4, bh7) | 0;
			mid = mid + Math.imul(ah4, bl7) | 0;
			hi = hi + Math.imul(ah4, bh7) | 0;
			lo = lo + Math.imul(al3, bl8) | 0;
			mid = mid + Math.imul(al3, bh8) | 0;
			mid = mid + Math.imul(ah3, bl8) | 0;
			hi = hi + Math.imul(ah3, bh8) | 0;
			lo = lo + Math.imul(al2, bl9) | 0;
			mid = mid + Math.imul(al2, bh9) | 0;
			mid = mid + Math.imul(ah2, bl9) | 0;
			hi = hi + Math.imul(ah2, bh9) | 0;
			var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
			w11 &= 67108863;
			lo = Math.imul(al9, bl3);
			mid = Math.imul(al9, bh3);
			mid = mid + Math.imul(ah9, bl3) | 0;
			hi = Math.imul(ah9, bh3);
			lo = lo + Math.imul(al8, bl4) | 0;
			mid = mid + Math.imul(al8, bh4) | 0;
			mid = mid + Math.imul(ah8, bl4) | 0;
			hi = hi + Math.imul(ah8, bh4) | 0;
			lo = lo + Math.imul(al7, bl5) | 0;
			mid = mid + Math.imul(al7, bh5) | 0;
			mid = mid + Math.imul(ah7, bl5) | 0;
			hi = hi + Math.imul(ah7, bh5) | 0;
			lo = lo + Math.imul(al6, bl6) | 0;
			mid = mid + Math.imul(al6, bh6) | 0;
			mid = mid + Math.imul(ah6, bl6) | 0;
			hi = hi + Math.imul(ah6, bh6) | 0;
			lo = lo + Math.imul(al5, bl7) | 0;
			mid = mid + Math.imul(al5, bh7) | 0;
			mid = mid + Math.imul(ah5, bl7) | 0;
			hi = hi + Math.imul(ah5, bh7) | 0;
			lo = lo + Math.imul(al4, bl8) | 0;
			mid = mid + Math.imul(al4, bh8) | 0;
			mid = mid + Math.imul(ah4, bl8) | 0;
			hi = hi + Math.imul(ah4, bh8) | 0;
			lo = lo + Math.imul(al3, bl9) | 0;
			mid = mid + Math.imul(al3, bh9) | 0;
			mid = mid + Math.imul(ah3, bl9) | 0;
			hi = hi + Math.imul(ah3, bh9) | 0;
			var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
			w12 &= 67108863;
			lo = Math.imul(al9, bl4);
			mid = Math.imul(al9, bh4);
			mid = mid + Math.imul(ah9, bl4) | 0;
			hi = Math.imul(ah9, bh4);
			lo = lo + Math.imul(al8, bl5) | 0;
			mid = mid + Math.imul(al8, bh5) | 0;
			mid = mid + Math.imul(ah8, bl5) | 0;
			hi = hi + Math.imul(ah8, bh5) | 0;
			lo = lo + Math.imul(al7, bl6) | 0;
			mid = mid + Math.imul(al7, bh6) | 0;
			mid = mid + Math.imul(ah7, bl6) | 0;
			hi = hi + Math.imul(ah7, bh6) | 0;
			lo = lo + Math.imul(al6, bl7) | 0;
			mid = mid + Math.imul(al6, bh7) | 0;
			mid = mid + Math.imul(ah6, bl7) | 0;
			hi = hi + Math.imul(ah6, bh7) | 0;
			lo = lo + Math.imul(al5, bl8) | 0;
			mid = mid + Math.imul(al5, bh8) | 0;
			mid = mid + Math.imul(ah5, bl8) | 0;
			hi = hi + Math.imul(ah5, bh8) | 0;
			lo = lo + Math.imul(al4, bl9) | 0;
			mid = mid + Math.imul(al4, bh9) | 0;
			mid = mid + Math.imul(ah4, bl9) | 0;
			hi = hi + Math.imul(ah4, bh9) | 0;
			var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
			w13 &= 67108863;
			lo = Math.imul(al9, bl5);
			mid = Math.imul(al9, bh5);
			mid = mid + Math.imul(ah9, bl5) | 0;
			hi = Math.imul(ah9, bh5);
			lo = lo + Math.imul(al8, bl6) | 0;
			mid = mid + Math.imul(al8, bh6) | 0;
			mid = mid + Math.imul(ah8, bl6) | 0;
			hi = hi + Math.imul(ah8, bh6) | 0;
			lo = lo + Math.imul(al7, bl7) | 0;
			mid = mid + Math.imul(al7, bh7) | 0;
			mid = mid + Math.imul(ah7, bl7) | 0;
			hi = hi + Math.imul(ah7, bh7) | 0;
			lo = lo + Math.imul(al6, bl8) | 0;
			mid = mid + Math.imul(al6, bh8) | 0;
			mid = mid + Math.imul(ah6, bl8) | 0;
			hi = hi + Math.imul(ah6, bh8) | 0;
			lo = lo + Math.imul(al5, bl9) | 0;
			mid = mid + Math.imul(al5, bh9) | 0;
			mid = mid + Math.imul(ah5, bl9) | 0;
			hi = hi + Math.imul(ah5, bh9) | 0;
			var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
			w14 &= 67108863;
			lo = Math.imul(al9, bl6);
			mid = Math.imul(al9, bh6);
			mid = mid + Math.imul(ah9, bl6) | 0;
			hi = Math.imul(ah9, bh6);
			lo = lo + Math.imul(al8, bl7) | 0;
			mid = mid + Math.imul(al8, bh7) | 0;
			mid = mid + Math.imul(ah8, bl7) | 0;
			hi = hi + Math.imul(ah8, bh7) | 0;
			lo = lo + Math.imul(al7, bl8) | 0;
			mid = mid + Math.imul(al7, bh8) | 0;
			mid = mid + Math.imul(ah7, bl8) | 0;
			hi = hi + Math.imul(ah7, bh8) | 0;
			lo = lo + Math.imul(al6, bl9) | 0;
			mid = mid + Math.imul(al6, bh9) | 0;
			mid = mid + Math.imul(ah6, bl9) | 0;
			hi = hi + Math.imul(ah6, bh9) | 0;
			var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
			w15 &= 67108863;
			lo = Math.imul(al9, bl7);
			mid = Math.imul(al9, bh7);
			mid = mid + Math.imul(ah9, bl7) | 0;
			hi = Math.imul(ah9, bh7);
			lo = lo + Math.imul(al8, bl8) | 0;
			mid = mid + Math.imul(al8, bh8) | 0;
			mid = mid + Math.imul(ah8, bl8) | 0;
			hi = hi + Math.imul(ah8, bh8) | 0;
			lo = lo + Math.imul(al7, bl9) | 0;
			mid = mid + Math.imul(al7, bh9) | 0;
			mid = mid + Math.imul(ah7, bl9) | 0;
			hi = hi + Math.imul(ah7, bh9) | 0;
			var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
			w16 &= 67108863;
			lo = Math.imul(al9, bl8);
			mid = Math.imul(al9, bh8);
			mid = mid + Math.imul(ah9, bl8) | 0;
			hi = Math.imul(ah9, bh8);
			lo = lo + Math.imul(al8, bl9) | 0;
			mid = mid + Math.imul(al8, bh9) | 0;
			mid = mid + Math.imul(ah8, bl9) | 0;
			hi = hi + Math.imul(ah8, bh9) | 0;
			var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
			w17 &= 67108863;
			lo = Math.imul(al9, bl9);
			mid = Math.imul(al9, bh9);
			mid = mid + Math.imul(ah9, bl9) | 0;
			hi = Math.imul(ah9, bh9);
			var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
			w18 &= 67108863;
			o[0] = w0;
			o[1] = w1;
			o[2] = w2;
			o[3] = w3;
			o[4] = w4;
			o[5] = w5;
			o[6] = w6;
			o[7] = w7;
			o[8] = w8;
			o[9] = w9;
			o[10] = w10;
			o[11] = w11;
			o[12] = w12;
			o[13] = w13;
			o[14] = w14;
			o[15] = w15;
			o[16] = w16;
			o[17] = w17;
			o[18] = w18;
			if (c !== 0) {
				o[19] = c;
				out.length++;
			}
			return out;
		};
		if (!Math.imul) comb10MulTo = smallMulTo;
		function bigMulTo(self, num, out) {
			out.negative = num.negative ^ self.negative;
			out.length = self.length + num.length;
			var carry = 0;
			var hncarry = 0;
			for (var k = 0; k < out.length - 1; k++) {
				var ncarry = hncarry;
				hncarry = 0;
				var rword = carry & 67108863;
				var maxJ = Math.min(k, num.length - 1);
				for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
					var i = k - j;
					var r = (self.words[i] | 0) * (num.words[j] | 0);
					var lo = r & 67108863;
					ncarry = ncarry + (r / 67108864 | 0) | 0;
					lo = lo + rword | 0;
					rword = lo & 67108863;
					ncarry = ncarry + (lo >>> 26) | 0;
					hncarry += ncarry >>> 26;
					ncarry &= 67108863;
				}
				out.words[k] = rword;
				carry = ncarry;
				ncarry = hncarry;
			}
			if (carry !== 0) out.words[k] = carry;
			else out.length--;
			return out._strip();
		}
		function jumboMulTo(self, num, out) {
			return bigMulTo(self, num, out);
		}
		BN.prototype.mulTo = function mulTo(num, out) {
			var res;
			var len = this.length + num.length;
			if (this.length === 10 && num.length === 10) res = comb10MulTo(this, num, out);
			else if (len < 63) res = smallMulTo(this, num, out);
			else if (len < 1024) res = bigMulTo(this, num, out);
			else res = jumboMulTo(this, num, out);
			return res;
		};
		function FFTM(x, y) {
			this.x = x;
			this.y = y;
		}
		FFTM.prototype.makeRBT = function makeRBT(N) {
			var t = new Array(N);
			var l = BN.prototype._countBits(N) - 1;
			for (var i = 0; i < N; i++) t[i] = this.revBin(i, l, N);
			return t;
		};
		FFTM.prototype.revBin = function revBin(x, l, N) {
			if (x === 0 || x === N - 1) return x;
			var rb = 0;
			for (var i = 0; i < l; i++) {
				rb |= (x & 1) << l - i - 1;
				x >>= 1;
			}
			return rb;
		};
		FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
			for (var i = 0; i < N; i++) {
				rtws[i] = rws[rbt[i]];
				itws[i] = iws[rbt[i]];
			}
		};
		FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
			this.permute(rbt, rws, iws, rtws, itws, N);
			for (var s = 1; s < N; s <<= 1) {
				var l = s << 1;
				var rtwdf = Math.cos(2 * Math.PI / l);
				var itwdf = Math.sin(2 * Math.PI / l);
				for (var p = 0; p < N; p += l) {
					var rtwdf_ = rtwdf;
					var itwdf_ = itwdf;
					for (var j = 0; j < s; j++) {
						var re = rtws[p + j];
						var ie = itws[p + j];
						var ro = rtws[p + j + s];
						var io = itws[p + j + s];
						var rx = rtwdf_ * ro - itwdf_ * io;
						io = rtwdf_ * io + itwdf_ * ro;
						ro = rx;
						rtws[p + j] = re + ro;
						itws[p + j] = ie + io;
						rtws[p + j + s] = re - ro;
						itws[p + j + s] = ie - io;
						if (j !== l) {
							rx = rtwdf * rtwdf_ - itwdf * itwdf_;
							itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
							rtwdf_ = rx;
						}
					}
				}
			}
		};
		FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
			var N = Math.max(m, n) | 1;
			var odd = N & 1;
			var i = 0;
			for (N = N / 2 | 0; N; N = N >>> 1) i++;
			return 1 << i + 1 + odd;
		};
		FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
			if (N <= 1) return;
			for (var i = 0; i < N / 2; i++) {
				var t = rws[i];
				rws[i] = rws[N - i - 1];
				rws[N - i - 1] = t;
				t = iws[i];
				iws[i] = -iws[N - i - 1];
				iws[N - i - 1] = -t;
			}
		};
		FFTM.prototype.normalize13b = function normalize13b(ws, N) {
			var carry = 0;
			for (var i = 0; i < N / 2; i++) {
				var w = Math.round(ws[2 * i + 1] / N) * 8192 + Math.round(ws[2 * i] / N) + carry;
				ws[i] = w & 67108863;
				if (w < 67108864) carry = 0;
				else carry = w / 67108864 | 0;
			}
			return ws;
		};
		FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
			var carry = 0;
			for (var i = 0; i < len; i++) {
				carry = carry + (ws[i] | 0);
				rws[2 * i] = carry & 8191;
				carry = carry >>> 13;
				rws[2 * i + 1] = carry & 8191;
				carry = carry >>> 13;
			}
			for (i = 2 * len; i < N; ++i) rws[i] = 0;
			assert(carry === 0);
			assert((carry & -8192) === 0);
		};
		FFTM.prototype.stub = function stub(N) {
			var ph = new Array(N);
			for (var i = 0; i < N; i++) ph[i] = 0;
			return ph;
		};
		FFTM.prototype.mulp = function mulp(x, y, out) {
			var N = 2 * this.guessLen13b(x.length, y.length);
			var rbt = this.makeRBT(N);
			var _ = this.stub(N);
			var rws = new Array(N);
			var rwst = new Array(N);
			var iwst = new Array(N);
			var nrws = new Array(N);
			var nrwst = new Array(N);
			var niwst = new Array(N);
			var rmws = out.words;
			rmws.length = N;
			this.convert13b(x.words, x.length, rws, N);
			this.convert13b(y.words, y.length, nrws, N);
			this.transform(rws, _, rwst, iwst, N, rbt);
			this.transform(nrws, _, nrwst, niwst, N, rbt);
			for (var i = 0; i < N; i++) {
				var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
				iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
				rwst[i] = rx;
			}
			this.conjugate(rwst, iwst, N);
			this.transform(rwst, iwst, rmws, _, N, rbt);
			this.conjugate(rmws, _, N);
			this.normalize13b(rmws, N);
			out.negative = x.negative ^ y.negative;
			out.length = x.length + y.length;
			return out._strip();
		};
		BN.prototype.mul = function mul(num) {
			var out = new BN(null);
			out.words = new Array(this.length + num.length);
			return this.mulTo(num, out);
		};
		BN.prototype.mulf = function mulf(num) {
			var out = new BN(null);
			out.words = new Array(this.length + num.length);
			return jumboMulTo(this, num, out);
		};
		BN.prototype.imul = function imul(num) {
			return this.clone().mulTo(num, this);
		};
		BN.prototype.imuln = function imuln(num) {
			var isNegNum = num < 0;
			if (isNegNum) num = -num;
			assert(typeof num === "number");
			assert(num < 67108864);
			var carry = 0;
			for (var i = 0; i < this.length; i++) {
				var w = (this.words[i] | 0) * num;
				var lo = (w & 67108863) + (carry & 67108863);
				carry >>= 26;
				carry += w / 67108864 | 0;
				carry += lo >>> 26;
				this.words[i] = lo & 67108863;
			}
			if (carry !== 0) {
				this.words[i] = carry;
				this.length++;
			}
			if (num === 0) {
				this.length = 1;
				this._normSign();
			}
			return isNegNum ? this.ineg() : this;
		};
		BN.prototype.muln = function muln(num) {
			return this.clone().imuln(num);
		};
		BN.prototype.sqr = function sqr() {
			return this.mul(this);
		};
		BN.prototype.isqr = function isqr() {
			return this.imul(this.clone());
		};
		BN.prototype.pow = function pow(num) {
			var w = toBitArray(num);
			if (w.length === 0) return new BN(1);
			var res = this;
			for (var i = 0; i < w.length; i++, res = res.sqr()) if (w[i] !== 0) break;
			if (++i < w.length) for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
				if (w[i] === 0) continue;
				res = res.mul(q);
			}
			return res;
		};
		BN.prototype.iushln = function iushln(bits) {
			assert(typeof bits === "number" && bits >= 0);
			var r = bits % 26;
			var s = (bits - r) / 26;
			var carryMask = 67108863 >>> 26 - r << 26 - r;
			var i;
			if (r !== 0) {
				var carry = 0;
				for (i = 0; i < this.length; i++) {
					var newCarry = this.words[i] & carryMask;
					var c = (this.words[i] | 0) - newCarry << r;
					this.words[i] = c | carry;
					carry = newCarry >>> 26 - r;
				}
				if (carry) {
					this.words[i] = carry;
					this.length++;
				}
			}
			if (s !== 0) {
				for (i = this.length - 1; i >= 0; i--) this.words[i + s] = this.words[i];
				for (i = 0; i < s; i++) this.words[i] = 0;
				this.length += s;
			}
			return this._strip();
		};
		BN.prototype.ishln = function ishln(bits) {
			assert(this.negative === 0);
			return this.iushln(bits);
		};
		BN.prototype.iushrn = function iushrn(bits, hint, extended) {
			assert(typeof bits === "number" && bits >= 0);
			var h;
			if (hint) h = (hint - hint % 26) / 26;
			else h = 0;
			var r = bits % 26;
			var s = Math.min((bits - r) / 26, this.length);
			var mask = 67108863 ^ 67108863 >>> r << r;
			var maskedWords = extended;
			h -= s;
			h = Math.max(0, h);
			if (maskedWords) {
				for (var i = 0; i < s; i++) maskedWords.words[i] = this.words[i];
				maskedWords.length = s;
			}
			if (s === 0) {} else if (this.length > s) {
				this.length -= s;
				for (i = 0; i < this.length; i++) this.words[i] = this.words[i + s];
			} else {
				this.words[0] = 0;
				this.length = 1;
			}
			var carry = 0;
			for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
				var word = this.words[i] | 0;
				this.words[i] = carry << 26 - r | word >>> r;
				carry = word & mask;
			}
			if (maskedWords && carry !== 0) maskedWords.words[maskedWords.length++] = carry;
			if (this.length === 0) {
				this.words[0] = 0;
				this.length = 1;
			}
			return this._strip();
		};
		BN.prototype.ishrn = function ishrn(bits, hint, extended) {
			assert(this.negative === 0);
			return this.iushrn(bits, hint, extended);
		};
		BN.prototype.shln = function shln(bits) {
			return this.clone().ishln(bits);
		};
		BN.prototype.ushln = function ushln(bits) {
			return this.clone().iushln(bits);
		};
		BN.prototype.shrn = function shrn(bits) {
			return this.clone().ishrn(bits);
		};
		BN.prototype.ushrn = function ushrn(bits) {
			return this.clone().iushrn(bits);
		};
		BN.prototype.testn = function testn(bit) {
			assert(typeof bit === "number" && bit >= 0);
			var r = bit % 26;
			var s = (bit - r) / 26;
			var q = 1 << r;
			if (this.length <= s) return false;
			return !!(this.words[s] & q);
		};
		BN.prototype.imaskn = function imaskn(bits) {
			assert(typeof bits === "number" && bits >= 0);
			var r = bits % 26;
			var s = (bits - r) / 26;
			assert(this.negative === 0, "imaskn works only with positive numbers");
			if (this.length <= s) return this;
			if (r !== 0) s++;
			this.length = Math.min(s, this.length);
			if (r !== 0) {
				var mask = 67108863 ^ 67108863 >>> r << r;
				this.words[this.length - 1] &= mask;
			}
			if (this.length === 0) {
				this.words[0] = 0;
				this.length = 1;
			}
			return this._strip();
		};
		BN.prototype.maskn = function maskn(bits) {
			return this.clone().imaskn(bits);
		};
		BN.prototype.iaddn = function iaddn(num) {
			assert(typeof num === "number");
			assert(num < 67108864);
			if (num < 0) return this.isubn(-num);
			if (this.negative !== 0) {
				if (this.length === 1 && (this.words[0] | 0) <= num) {
					this.words[0] = num - (this.words[0] | 0);
					this.negative = 0;
					return this;
				}
				this.negative = 0;
				this.isubn(num);
				this.negative = 1;
				return this;
			}
			return this._iaddn(num);
		};
		BN.prototype._iaddn = function _iaddn(num) {
			this.words[0] += num;
			for (var i = 0; i < this.length && this.words[i] >= 67108864; i++) {
				this.words[i] -= 67108864;
				if (i === this.length - 1) this.words[i + 1] = 1;
				else this.words[i + 1]++;
			}
			this.length = Math.max(this.length, i + 1);
			return this;
		};
		BN.prototype.isubn = function isubn(num) {
			assert(typeof num === "number");
			assert(num < 67108864);
			if (num < 0) return this.iaddn(-num);
			if (this.negative !== 0) {
				this.negative = 0;
				this.iaddn(num);
				this.negative = 1;
				return this;
			}
			this.words[0] -= num;
			if (this.length === 1 && this.words[0] < 0) {
				this.words[0] = -this.words[0];
				this.negative = 1;
			} else for (var i = 0; i < this.length && this.words[i] < 0; i++) {
				this.words[i] += 67108864;
				this.words[i + 1] -= 1;
			}
			return this._strip();
		};
		BN.prototype.addn = function addn(num) {
			return this.clone().iaddn(num);
		};
		BN.prototype.subn = function subn(num) {
			return this.clone().isubn(num);
		};
		BN.prototype.iabs = function iabs() {
			this.negative = 0;
			return this;
		};
		BN.prototype.abs = function abs() {
			return this.clone().iabs();
		};
		BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
			var len = num.length + shift;
			var i;
			this._expand(len);
			var w;
			var carry = 0;
			for (i = 0; i < num.length; i++) {
				w = (this.words[i + shift] | 0) + carry;
				var right = (num.words[i] | 0) * mul;
				w -= right & 67108863;
				carry = (w >> 26) - (right / 67108864 | 0);
				this.words[i + shift] = w & 67108863;
			}
			for (; i < this.length - shift; i++) {
				w = (this.words[i + shift] | 0) + carry;
				carry = w >> 26;
				this.words[i + shift] = w & 67108863;
			}
			if (carry === 0) return this._strip();
			assert(carry === -1);
			carry = 0;
			for (i = 0; i < this.length; i++) {
				w = -(this.words[i] | 0) + carry;
				carry = w >> 26;
				this.words[i] = w & 67108863;
			}
			this.negative = 1;
			return this._strip();
		};
		BN.prototype._wordDiv = function _wordDiv(num, mode) {
			var shift = this.length - num.length;
			var a = this.clone();
			var b = num;
			var bhi = b.words[b.length - 1] | 0;
			shift = 26 - this._countBits(bhi);
			if (shift !== 0) {
				b = b.ushln(shift);
				a.iushln(shift);
				bhi = b.words[b.length - 1] | 0;
			}
			var m = a.length - b.length;
			var q;
			if (mode !== "mod") {
				q = new BN(null);
				q.length = m + 1;
				q.words = new Array(q.length);
				for (var i = 0; i < q.length; i++) q.words[i] = 0;
			}
			var diff = a.clone()._ishlnsubmul(b, 1, m);
			if (diff.negative === 0) {
				a = diff;
				if (q) q.words[m] = 1;
			}
			for (var j = m - 1; j >= 0; j--) {
				var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
				qj = Math.min(qj / bhi | 0, 67108863);
				a._ishlnsubmul(b, qj, j);
				while (a.negative !== 0) {
					qj--;
					a.negative = 0;
					a._ishlnsubmul(b, 1, j);
					if (!a.isZero()) a.negative ^= 1;
				}
				if (q) q.words[j] = qj;
			}
			if (q) q._strip();
			a._strip();
			if (mode !== "div" && shift !== 0) a.iushrn(shift);
			return {
				div: q || null,
				mod: a
			};
		};
		BN.prototype.divmod = function divmod(num, mode, positive) {
			assert(!num.isZero());
			if (this.isZero()) return {
				div: new BN(0),
				mod: new BN(0)
			};
			var div, mod, res;
			if (this.negative !== 0 && num.negative === 0) {
				res = this.neg().divmod(num, mode);
				if (mode !== "mod") div = res.div.neg();
				if (mode !== "div") {
					mod = res.mod.neg();
					if (positive && mod.negative !== 0) mod.iadd(num);
				}
				return {
					div,
					mod
				};
			}
			if (this.negative === 0 && num.negative !== 0) {
				res = this.divmod(num.neg(), mode);
				if (mode !== "mod") div = res.div.neg();
				return {
					div,
					mod: res.mod
				};
			}
			if ((this.negative & num.negative) !== 0) {
				res = this.neg().divmod(num.neg(), mode);
				if (mode !== "div") {
					mod = res.mod.neg();
					if (positive && mod.negative !== 0) mod.isub(num);
				}
				return {
					div: res.div,
					mod
				};
			}
			if (num.length > this.length || this.cmp(num) < 0) return {
				div: new BN(0),
				mod: this
			};
			if (num.length === 1) {
				if (mode === "div") return {
					div: this.divn(num.words[0]),
					mod: null
				};
				if (mode === "mod") return {
					div: null,
					mod: new BN(this.modrn(num.words[0]))
				};
				return {
					div: this.divn(num.words[0]),
					mod: new BN(this.modrn(num.words[0]))
				};
			}
			return this._wordDiv(num, mode);
		};
		BN.prototype.div = function div(num) {
			return this.divmod(num, "div", false).div;
		};
		BN.prototype.mod = function mod(num) {
			return this.divmod(num, "mod", false).mod;
		};
		BN.prototype.umod = function umod(num) {
			return this.divmod(num, "mod", true).mod;
		};
		BN.prototype.divRound = function divRound(num) {
			var dm = this.divmod(num);
			if (dm.mod.isZero()) return dm.div;
			var mod = dm.mod.abs();
			var half = num.abs().iushrn(1);
			var r2 = num.words[0] & 1;
			var cmp = mod.cmp(half);
			if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;
			var up = new BN(1);
			up.negative = this.negative ^ num.negative;
			return dm.div.iadd(up);
		};
		BN.prototype.modrn = function modrn(num) {
			var isNegNum = num < 0;
			if (isNegNum) num = -num;
			assert(num <= 67108863);
			var p = (1 << 26) % num;
			var acc = 0;
			for (var i = this.length - 1; i >= 0; i--) acc = (p * acc + (this.words[i] | 0)) % num;
			return isNegNum ? -acc : acc;
		};
		BN.prototype.modn = function modn(num) {
			return this.modrn(num);
		};
		BN.prototype.idivn = function idivn(num) {
			var isNegNum = num < 0;
			if (isNegNum) num = -num;
			assert(num <= 67108863);
			var carry = 0;
			for (var i = this.length - 1; i >= 0; i--) {
				var w = (this.words[i] | 0) + carry * 67108864;
				this.words[i] = w / num | 0;
				carry = w % num;
			}
			this._strip();
			return isNegNum ? this.ineg() : this;
		};
		BN.prototype.divn = function divn(num) {
			return this.clone().idivn(num);
		};
		BN.prototype.egcd = function egcd(p) {
			assert(p.negative === 0);
			assert(!p.isZero());
			var x = this;
			var y = p.clone();
			if (x.negative !== 0) x = x.umod(p);
			else x = x.clone();
			var A = new BN(1);
			var B = new BN(0);
			var C = new BN(0);
			var D = new BN(1);
			var g = 0;
			while (x.isEven() && y.isEven()) {
				x.iushrn(1);
				y.iushrn(1);
				++g;
			}
			var yp = y.clone();
			var xp = x.clone();
			while (!x.isZero()) {
				for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
				if (i > 0) {
					x.iushrn(i);
					while (i-- > 0) {
						if (A.isOdd() || B.isOdd()) {
							A.iadd(yp);
							B.isub(xp);
						}
						A.iushrn(1);
						B.iushrn(1);
					}
				}
				for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
				if (j > 0) {
					y.iushrn(j);
					while (j-- > 0) {
						if (C.isOdd() || D.isOdd()) {
							C.iadd(yp);
							D.isub(xp);
						}
						C.iushrn(1);
						D.iushrn(1);
					}
				}
				if (x.cmp(y) >= 0) {
					x.isub(y);
					A.isub(C);
					B.isub(D);
				} else {
					y.isub(x);
					C.isub(A);
					D.isub(B);
				}
			}
			return {
				a: C,
				b: D,
				gcd: y.iushln(g)
			};
		};
		BN.prototype._invmp = function _invmp(p) {
			assert(p.negative === 0);
			assert(!p.isZero());
			var a = this;
			var b = p.clone();
			if (a.negative !== 0) a = a.umod(p);
			else a = a.clone();
			var x1 = new BN(1);
			var x2 = new BN(0);
			var delta = b.clone();
			while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
				for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
				if (i > 0) {
					a.iushrn(i);
					while (i-- > 0) {
						if (x1.isOdd()) x1.iadd(delta);
						x1.iushrn(1);
					}
				}
				for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
				if (j > 0) {
					b.iushrn(j);
					while (j-- > 0) {
						if (x2.isOdd()) x2.iadd(delta);
						x2.iushrn(1);
					}
				}
				if (a.cmp(b) >= 0) {
					a.isub(b);
					x1.isub(x2);
				} else {
					b.isub(a);
					x2.isub(x1);
				}
			}
			var res;
			if (a.cmpn(1) === 0) res = x1;
			else res = x2;
			if (res.cmpn(0) < 0) res.iadd(p);
			return res;
		};
		BN.prototype.gcd = function gcd(num) {
			if (this.isZero()) return num.abs();
			if (num.isZero()) return this.abs();
			var a = this.clone();
			var b = num.clone();
			a.negative = 0;
			b.negative = 0;
			for (var shift = 0; a.isEven() && b.isEven(); shift++) {
				a.iushrn(1);
				b.iushrn(1);
			}
			do {
				while (a.isEven()) a.iushrn(1);
				while (b.isEven()) b.iushrn(1);
				var r = a.cmp(b);
				if (r < 0) {
					var t = a;
					a = b;
					b = t;
				} else if (r === 0 || b.cmpn(1) === 0) break;
				a.isub(b);
			} while (true);
			return b.iushln(shift);
		};
		BN.prototype.invm = function invm(num) {
			return this.egcd(num).a.umod(num);
		};
		BN.prototype.isEven = function isEven() {
			return (this.words[0] & 1) === 0;
		};
		BN.prototype.isOdd = function isOdd() {
			return (this.words[0] & 1) === 1;
		};
		BN.prototype.andln = function andln(num) {
			return this.words[0] & num;
		};
		BN.prototype.bincn = function bincn(bit) {
			assert(typeof bit === "number");
			var r = bit % 26;
			var s = (bit - r) / 26;
			var q = 1 << r;
			if (this.length <= s) {
				this._expand(s + 1);
				this.words[s] |= q;
				return this;
			}
			var carry = q;
			for (var i = s; carry !== 0 && i < this.length; i++) {
				var w = this.words[i] | 0;
				w += carry;
				carry = w >>> 26;
				w &= 67108863;
				this.words[i] = w;
			}
			if (carry !== 0) {
				this.words[i] = carry;
				this.length++;
			}
			return this;
		};
		BN.prototype.isZero = function isZero() {
			return this.length === 1 && this.words[0] === 0;
		};
		BN.prototype.cmpn = function cmpn(num) {
			var negative = num < 0;
			if (this.negative !== 0 && !negative) return -1;
			if (this.negative === 0 && negative) return 1;
			this._strip();
			var res;
			if (this.length > 1) res = 1;
			else {
				if (negative) num = -num;
				assert(num <= 67108863, "Number is too big");
				var w = this.words[0] | 0;
				res = w === num ? 0 : w < num ? -1 : 1;
			}
			if (this.negative !== 0) return -res | 0;
			return res;
		};
		BN.prototype.cmp = function cmp(num) {
			if (this.negative !== 0 && num.negative === 0) return -1;
			if (this.negative === 0 && num.negative !== 0) return 1;
			var res = this.ucmp(num);
			if (this.negative !== 0) return -res | 0;
			return res;
		};
		BN.prototype.ucmp = function ucmp(num) {
			if (this.length > num.length) return 1;
			if (this.length < num.length) return -1;
			var res = 0;
			for (var i = this.length - 1; i >= 0; i--) {
				var a = this.words[i] | 0;
				var b = num.words[i] | 0;
				if (a === b) continue;
				if (a < b) res = -1;
				else if (a > b) res = 1;
				break;
			}
			return res;
		};
		BN.prototype.gtn = function gtn(num) {
			return this.cmpn(num) === 1;
		};
		BN.prototype.gt = function gt(num) {
			return this.cmp(num) === 1;
		};
		BN.prototype.gten = function gten(num) {
			return this.cmpn(num) >= 0;
		};
		BN.prototype.gte = function gte(num) {
			return this.cmp(num) >= 0;
		};
		BN.prototype.ltn = function ltn(num) {
			return this.cmpn(num) === -1;
		};
		BN.prototype.lt = function lt(num) {
			return this.cmp(num) === -1;
		};
		BN.prototype.lten = function lten(num) {
			return this.cmpn(num) <= 0;
		};
		BN.prototype.lte = function lte(num) {
			return this.cmp(num) <= 0;
		};
		BN.prototype.eqn = function eqn(num) {
			return this.cmpn(num) === 0;
		};
		BN.prototype.eq = function eq(num) {
			return this.cmp(num) === 0;
		};
		BN.red = function red(num) {
			return new Red(num);
		};
		BN.prototype.toRed = function toRed(ctx) {
			assert(!this.red, "Already a number in reduction context");
			assert(this.negative === 0, "red works only with positives");
			return ctx.convertTo(this)._forceRed(ctx);
		};
		BN.prototype.fromRed = function fromRed() {
			assert(this.red, "fromRed works only with numbers in reduction context");
			return this.red.convertFrom(this);
		};
		BN.prototype._forceRed = function _forceRed(ctx) {
			this.red = ctx;
			return this;
		};
		BN.prototype.forceRed = function forceRed(ctx) {
			assert(!this.red, "Already a number in reduction context");
			return this._forceRed(ctx);
		};
		BN.prototype.redAdd = function redAdd(num) {
			assert(this.red, "redAdd works only with red numbers");
			return this.red.add(this, num);
		};
		BN.prototype.redIAdd = function redIAdd(num) {
			assert(this.red, "redIAdd works only with red numbers");
			return this.red.iadd(this, num);
		};
		BN.prototype.redSub = function redSub(num) {
			assert(this.red, "redSub works only with red numbers");
			return this.red.sub(this, num);
		};
		BN.prototype.redISub = function redISub(num) {
			assert(this.red, "redISub works only with red numbers");
			return this.red.isub(this, num);
		};
		BN.prototype.redShl = function redShl(num) {
			assert(this.red, "redShl works only with red numbers");
			return this.red.shl(this, num);
		};
		BN.prototype.redMul = function redMul(num) {
			assert(this.red, "redMul works only with red numbers");
			this.red._verify2(this, num);
			return this.red.mul(this, num);
		};
		BN.prototype.redIMul = function redIMul(num) {
			assert(this.red, "redMul works only with red numbers");
			this.red._verify2(this, num);
			return this.red.imul(this, num);
		};
		BN.prototype.redSqr = function redSqr() {
			assert(this.red, "redSqr works only with red numbers");
			this.red._verify1(this);
			return this.red.sqr(this);
		};
		BN.prototype.redISqr = function redISqr() {
			assert(this.red, "redISqr works only with red numbers");
			this.red._verify1(this);
			return this.red.isqr(this);
		};
		BN.prototype.redSqrt = function redSqrt() {
			assert(this.red, "redSqrt works only with red numbers");
			this.red._verify1(this);
			return this.red.sqrt(this);
		};
		BN.prototype.redInvm = function redInvm() {
			assert(this.red, "redInvm works only with red numbers");
			this.red._verify1(this);
			return this.red.invm(this);
		};
		BN.prototype.redNeg = function redNeg() {
			assert(this.red, "redNeg works only with red numbers");
			this.red._verify1(this);
			return this.red.neg(this);
		};
		BN.prototype.redPow = function redPow(num) {
			assert(this.red && !num.red, "redPow(normalNum)");
			this.red._verify1(this);
			return this.red.pow(this, num);
		};
		var primes = {
			k256: null,
			p224: null,
			p192: null,
			p25519: null
		};
		function MPrime(name, p) {
			this.name = name;
			this.p = new BN(p, 16);
			this.n = this.p.bitLength();
			this.k = new BN(1).iushln(this.n).isub(this.p);
			this.tmp = this._tmp();
		}
		MPrime.prototype._tmp = function _tmp() {
			var tmp = new BN(null);
			tmp.words = new Array(Math.ceil(this.n / 13));
			return tmp;
		};
		MPrime.prototype.ireduce = function ireduce(num) {
			var r = num;
			var rlen;
			do {
				this.split(r, this.tmp);
				r = this.imulK(r);
				r = r.iadd(this.tmp);
				rlen = r.bitLength();
			} while (rlen > this.n);
			var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
			if (cmp === 0) {
				r.words[0] = 0;
				r.length = 1;
			} else if (cmp > 0) r.isub(this.p);
			else if (r.strip !== void 0) r.strip();
			else r._strip();
			return r;
		};
		MPrime.prototype.split = function split(input, out) {
			input.iushrn(this.n, 0, out);
		};
		MPrime.prototype.imulK = function imulK(num) {
			return num.imul(this.k);
		};
		function K256() {
			MPrime.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
		}
		inherits(K256, MPrime);
		K256.prototype.split = function split(input, output) {
			var mask = 4194303;
			var outLen = Math.min(input.length, 9);
			for (var i = 0; i < outLen; i++) output.words[i] = input.words[i];
			output.length = outLen;
			if (input.length <= 9) {
				input.words[0] = 0;
				input.length = 1;
				return;
			}
			var prev = input.words[9];
			output.words[output.length++] = prev & mask;
			for (i = 10; i < input.length; i++) {
				var next = input.words[i] | 0;
				input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
				prev = next;
			}
			prev >>>= 22;
			input.words[i - 10] = prev;
			if (prev === 0 && input.length > 10) input.length -= 10;
			else input.length -= 9;
		};
		K256.prototype.imulK = function imulK(num) {
			num.words[num.length] = 0;
			num.words[num.length + 1] = 0;
			num.length += 2;
			var lo = 0;
			for (var i = 0; i < num.length; i++) {
				var w = num.words[i] | 0;
				lo += w * 977;
				num.words[i] = lo & 67108863;
				lo = w * 64 + (lo / 67108864 | 0);
			}
			if (num.words[num.length - 1] === 0) {
				num.length--;
				if (num.words[num.length - 1] === 0) num.length--;
			}
			return num;
		};
		function P224() {
			MPrime.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
		}
		inherits(P224, MPrime);
		function P192() {
			MPrime.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
		}
		inherits(P192, MPrime);
		function P25519() {
			MPrime.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
		}
		inherits(P25519, MPrime);
		P25519.prototype.imulK = function imulK(num) {
			var carry = 0;
			for (var i = 0; i < num.length; i++) {
				var hi = (num.words[i] | 0) * 19 + carry;
				var lo = hi & 67108863;
				hi >>>= 26;
				num.words[i] = lo;
				carry = hi;
			}
			if (carry !== 0) num.words[num.length++] = carry;
			return num;
		};
		BN._prime = function prime(name) {
			if (primes[name]) return primes[name];
			var prime;
			if (name === "k256") prime = new K256();
			else if (name === "p224") prime = new P224();
			else if (name === "p192") prime = new P192();
			else if (name === "p25519") prime = new P25519();
			else throw new Error("Unknown prime " + name);
			primes[name] = prime;
			return prime;
		};
		function Red(m) {
			if (typeof m === "string") {
				var prime = BN._prime(m);
				this.m = prime.p;
				this.prime = prime;
			} else {
				assert(m.gtn(1), "modulus must be greater than 1");
				this.m = m;
				this.prime = null;
			}
		}
		Red.prototype._verify1 = function _verify1(a) {
			assert(a.negative === 0, "red works only with positives");
			assert(a.red, "red works only with red numbers");
		};
		Red.prototype._verify2 = function _verify2(a, b) {
			assert((a.negative | b.negative) === 0, "red works only with positives");
			assert(a.red && a.red === b.red, "red works only with red numbers");
		};
		Red.prototype.imod = function imod(a) {
			if (this.prime) return this.prime.ireduce(a)._forceRed(this);
			move(a, a.umod(this.m)._forceRed(this));
			return a;
		};
		Red.prototype.neg = function neg(a) {
			if (a.isZero()) return a.clone();
			return this.m.sub(a)._forceRed(this);
		};
		Red.prototype.add = function add(a, b) {
			this._verify2(a, b);
			var res = a.add(b);
			if (res.cmp(this.m) >= 0) res.isub(this.m);
			return res._forceRed(this);
		};
		Red.prototype.iadd = function iadd(a, b) {
			this._verify2(a, b);
			var res = a.iadd(b);
			if (res.cmp(this.m) >= 0) res.isub(this.m);
			return res;
		};
		Red.prototype.sub = function sub(a, b) {
			this._verify2(a, b);
			var res = a.sub(b);
			if (res.cmpn(0) < 0) res.iadd(this.m);
			return res._forceRed(this);
		};
		Red.prototype.isub = function isub(a, b) {
			this._verify2(a, b);
			var res = a.isub(b);
			if (res.cmpn(0) < 0) res.iadd(this.m);
			return res;
		};
		Red.prototype.shl = function shl(a, num) {
			this._verify1(a);
			return this.imod(a.ushln(num));
		};
		Red.prototype.imul = function imul(a, b) {
			this._verify2(a, b);
			return this.imod(a.imul(b));
		};
		Red.prototype.mul = function mul(a, b) {
			this._verify2(a, b);
			return this.imod(a.mul(b));
		};
		Red.prototype.isqr = function isqr(a) {
			return this.imul(a, a.clone());
		};
		Red.prototype.sqr = function sqr(a) {
			return this.mul(a, a);
		};
		Red.prototype.sqrt = function sqrt(a) {
			if (a.isZero()) return a.clone();
			var mod3 = this.m.andln(3);
			assert(mod3 % 2 === 1);
			if (mod3 === 3) {
				var pow = this.m.add(new BN(1)).iushrn(2);
				return this.pow(a, pow);
			}
			var q = this.m.subn(1);
			var s = 0;
			while (!q.isZero() && q.andln(1) === 0) {
				s++;
				q.iushrn(1);
			}
			assert(!q.isZero());
			var one = new BN(1).toRed(this);
			var nOne = one.redNeg();
			var lpow = this.m.subn(1).iushrn(1);
			var z = this.m.bitLength();
			z = new BN(2 * z * z).toRed(this);
			while (this.pow(z, lpow).cmp(nOne) !== 0) z.redIAdd(nOne);
			var c = this.pow(z, q);
			var r = this.pow(a, q.addn(1).iushrn(1));
			var t = this.pow(a, q);
			var m = s;
			while (t.cmp(one) !== 0) {
				var tmp = t;
				for (var i = 0; tmp.cmp(one) !== 0; i++) tmp = tmp.redSqr();
				assert(i < m);
				var b = this.pow(c, new BN(1).iushln(m - i - 1));
				r = r.redMul(b);
				c = b.redSqr();
				t = t.redMul(c);
				m = i;
			}
			return r;
		};
		Red.prototype.invm = function invm(a) {
			var inv = a._invmp(this.m);
			if (inv.negative !== 0) {
				inv.negative = 0;
				return this.imod(inv).redNeg();
			} else return this.imod(inv);
		};
		Red.prototype.pow = function pow(a, num) {
			if (num.isZero()) return new BN(1).toRed(this);
			if (num.cmpn(1) === 0) return a.clone();
			var windowSize = 4;
			var wnd = new Array(1 << windowSize);
			wnd[0] = new BN(1).toRed(this);
			wnd[1] = a;
			for (var i = 2; i < wnd.length; i++) wnd[i] = this.mul(wnd[i - 1], a);
			var res = wnd[0];
			var current = 0;
			var currentLen = 0;
			var start = num.bitLength() % 26;
			if (start === 0) start = 26;
			for (i = num.length - 1; i >= 0; i--) {
				var word = num.words[i];
				for (var j = start - 1; j >= 0; j--) {
					var bit = word >> j & 1;
					if (res !== wnd[0]) res = this.sqr(res);
					if (bit === 0 && current === 0) {
						currentLen = 0;
						continue;
					}
					current <<= 1;
					current |= bit;
					currentLen++;
					if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;
					res = this.mul(res, wnd[current]);
					currentLen = 0;
					current = 0;
				}
				start = 26;
			}
			return res;
		};
		Red.prototype.convertTo = function convertTo(num) {
			var r = num.umod(this.m);
			return r === num ? r.clone() : r;
		};
		Red.prototype.convertFrom = function convertFrom(num) {
			var res = num.clone();
			res.red = null;
			return res;
		};
		BN.mont = function mont(num) {
			return new Mont(num);
		};
		function Mont(m) {
			Red.call(this, m);
			this.shift = this.m.bitLength();
			if (this.shift % 26 !== 0) this.shift += 26 - this.shift % 26;
			this.r = new BN(1).iushln(this.shift);
			this.r2 = this.imod(this.r.sqr());
			this.rinv = this.r._invmp(this.m);
			this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
			this.minv = this.minv.umod(this.r);
			this.minv = this.r.sub(this.minv);
		}
		inherits(Mont, Red);
		Mont.prototype.convertTo = function convertTo(num) {
			return this.imod(num.ushln(this.shift));
		};
		Mont.prototype.convertFrom = function convertFrom(num) {
			var r = this.imod(num.mul(this.rinv));
			r.red = null;
			return r;
		};
		Mont.prototype.imul = function imul(a, b) {
			if (a.isZero() || b.isZero()) {
				a.words[0] = 0;
				a.length = 1;
				return a;
			}
			var t = a.imul(b);
			var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
			var u = t.isub(c).iushrn(this.shift);
			var res = u;
			if (u.cmp(this.m) >= 0) res = u.isub(this.m);
			else if (u.cmpn(0) < 0) res = u.iadd(this.m);
			return res._forceRed(this);
		};
		Mont.prototype.mul = function mul(a, b) {
			if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
			var t = a.mul(b);
			var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
			var u = t.isub(c).iushrn(this.shift);
			var res = u;
			if (u.cmp(this.m) >= 0) res = u.isub(this.m);
			else if (u.cmpn(0) < 0) res = u.iadd(this.m);
			return res._forceRed(this);
		};
		Mont.prototype.invm = function invm(a) {
			return this.imod(a._invmp(this.m).mul(this.r2))._forceRed(this);
		};
	})(typeof module === "undefined" || module, exports);
}));
//#endregion
//#region node_modules/@algorandfoundation/xhd-wallet-api/dist/bip32-ed25519.js
var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
var import_ajv = /* @__PURE__ */ __toESM(require_ajv(), 1);
var import_bn = /* @__PURE__ */ __toESM(require_bn(), 1);
/**
* This function takes an array of up to 256 bits and sets the last g trailing bits to zero
*
* @param array - An array of up to 256 bits
* @param g - The number of bits to zero
* @returns - The array with the last g bits set to zero
*/
function trunc_256_minus_g_bits(array, g) {
	if (g < 0 || g > 256) throw Error("Number of bits to zero must be between 0 and 256.");
	const truncated = new Uint8Array(array);
	let remainingBits = g;
	for (let i = truncated.length - 1; i >= 0 && remainingBits > 0; i--) if (remainingBits >= 8) {
		truncated[i] = 0;
		remainingBits -= 8;
	} else {
		truncated[i] &= 255 >> remainingBits;
		break;
	}
	return truncated;
}
/**
* @see section V. BIP32-Ed25519: Specification;
*
* subsections:
*
* B) Child Keys
* and
* C) Private Child Key Derivation
*
* @param extendedKey - extended key (kL, kR, c) where kL is the left 32 bytes of the root key the scalar (pvtKey). kR is the right 32 bytes of the root key, and c is the chain code. Total 96 bytes
* @param index - index of the child key
* @param g - Defines how many bits to zero in the left 32 bytes of the child key. Standard BIP32-ed25519 derivations use 32 bits.
* @returns - (kL, kR, c) where kL is the left 32 bytes of the child key (the new scalar), kR is the right 32 bytes of the child key, and c is the chain code. Total 96 bytes
*/
async function deriveChildNodePrivate(extendedKey, index, g = 9) {
	const kL = Buffer.from(extendedKey.subarray(0, 32));
	const kR = Buffer.from(extendedKey.subarray(32, 64));
	const cc = extendedKey.subarray(64, 96);
	const { z, childChainCode } = index < 2147483648 ? derivedNonHardened(kL, cc, index) : deriveHardened(kL, kR, cc, index);
	const zLeft = z.subarray(0, 32);
	const zRight = z.subarray(32, 64);
	const zL = trunc_256_minus_g_bits(zLeft, g);
	const klBigNum = new import_bn.default(kL, 16, "le");
	const big8 = new import_bn.default(8);
	const zlBigNum = new import_bn.default(zL, 16, "le");
	const zlBigNumMul8 = klBigNum.add(zlBigNum.mul(big8));
	if (zlBigNumMul8.cmp(new import_bn.default(2).pow(new import_bn.default(255))) >= 0) {
		console.log(util.inspect(zlBigNumMul8), {
			colors: true,
			depth: null
		});
		throw Error("zL * 8 is larger than 2^255, which is not safe");
	}
	const left = klBigNum.add(zlBigNum.mul(big8)).toArrayLike(Buffer, "le", 32);
	let right = new import_bn.default(kR, 16, "le").add(new import_bn.default(zRight, 16, "le")).toArrayLike(Buffer, "le").slice(0, 32);
	const rightBuffer = Buffer.alloc(32);
	Buffer.from(right).copy(rightBuffer, 0, 0, right.length);
	return new Uint8Array(Buffer.concat([
		left,
		rightBuffer,
		childChainCode
	]));
}
/**
*
* @see section V. BIP32-Ed25519: Specification
*
* @param kl - The scalar
* @param cc - chain code
* @param index - non-hardened ( < 2^31 ) index
* @returns - (z, c) where z is the 64-byte child key and c is the chain code
*/
function derivedNonHardened(kl, cc, index) {
	const data = Buffer.allocUnsafe(37);
	data.writeUInt32LE(index, 33);
	Buffer.from(crypto_scalarmult_ed25519_base_noclamp(kl)).copy(data, 1);
	data[0] = 2;
	const z = createHmac("sha512", cc).update(data).digest();
	data[0] = 3;
	return {
		z,
		childChainCode: createHmac("sha512", cc).update(data).digest().subarray(32, 64)
	};
}
/**
*
* @see section V. BIP32-Ed25519: Specification
*
* @param kl - The scalar (a.k.a private key)
* @param kr - the right 32 bytes of the root key
* @param cc - chain code
* @param index - hardened ( >= 2^31 ) index
* @returns - (z, c) where z is the 64-byte child key and c is the chain code
*/
function deriveHardened(kl, kr, cc, index) {
	const data = Buffer.allocUnsafe(69);
	data.writeUInt32LE(index, 65);
	Buffer.from(kl).copy(data, 1);
	Buffer.from(kr).copy(data, 33);
	data[0] = 0;
	const z = createHmac("sha512", cc).update(data).digest();
	data[0] = 1;
	return {
		z,
		childChainCode: createHmac("sha512", cc).update(data).digest().subarray(32, 64)
	};
}
//#endregion
//#region node_modules/@algorandfoundation/xhd-wallet-api/dist/x.hd.wallet.api.crypto.js
/**
*
*/
var KeyContext;
(function(KeyContext) {
	KeyContext[KeyContext["Address"] = 0] = "Address";
	KeyContext[KeyContext["Identity"] = 1] = "Identity";
})(KeyContext || (KeyContext = {}));
var BIP32DerivationType;
(function(BIP32DerivationType) {
	BIP32DerivationType[BIP32DerivationType["Khovratovich"] = 32] = "Khovratovich";
	BIP32DerivationType[BIP32DerivationType["Peikert"] = 9] = "Peikert";
})(BIP32DerivationType || (BIP32DerivationType = {}));
var Encoding;
(function(Encoding) {
	Encoding["MSGPACK"] = "msgpack";
	Encoding["BASE64"] = "base64";
	Encoding["NONE"] = "none";
})(Encoding || (Encoding = {}));
var harden = (num) => 2147483648 + num;
function GetBIP44PathFromContext(context, account, key_index) {
	switch (context) {
		case KeyContext.Address: return [
			harden(44),
			harden(283),
			harden(account),
			0,
			key_index
		];
		case KeyContext.Identity: return [
			harden(44),
			harden(0),
			harden(account),
			0,
			key_index
		];
		default: throw Error("Invalid context");
	}
}
var ERROR_BAD_DATA = Error("Invalid Data");
var ERROR_TAGS_FOUND = Error("Transactions tags found");
var XHDWalletAPI = class {
	constructor() {}
	/**
	* Derives a child key from the root key based on BIP44 path
	*
	* @param rootKey - root key in extended format (kL, kR, c). It should be 96 bytes long
	* @param bip44Path - BIP44 path (m / purpose' / coin_type' / account' / change / address_index). The ' indicates that the value is hardened
	* @param isPrivate  - if true, return the private key, otherwise return the public key
	* @returns - The extended private key (kL, kR, chainCode) or the extended public key (pub, chainCode)
	*/
	async deriveKey(rootKey, bip44Path, isPrivate = true, derivationType) {
		const g = derivationType === BIP32DerivationType.Peikert ? 9 : 32;
		for (let i = 0; i < bip44Path.length; i++) rootKey = await deriveChildNodePrivate(rootKey, bip44Path[i], g);
		if (isPrivate) return rootKey;
		return new Uint8Array(Buffer.concat([crypto_scalarmult_ed25519_base_noclamp(rootKey.subarray(0, 32)), rootKey.subarray(64, 96)]));
	}
	/**
	*
	*
	* @param context - context of the key (i.e Address, Identity)
	* @param account - account number. This value will be hardened as part of BIP44
	* @param keyIndex - key index. This value will be a SOFT derivation as part of BIP44.
	* @returns - public key 32 bytes
	*/
	async keyGen(rootKey, context, account, keyIndex, derivationType = BIP32DerivationType.Peikert) {
		const bip44Path = GetBIP44PathFromContext(context, account, keyIndex);
		return (await this.deriveKey(rootKey, bip44Path, false, derivationType)).subarray(0, 32);
	}
	/**
	* Raw Signing function called by signData and signTransaction
	*
	* Ref: https://datatracker.ietf.org/doc/html/rfc8032#section-5.1.6
	*
	* Edwards-Curve Digital Signature Algorithm (EdDSA)
	*
	* @param bip44Path
	* - BIP44 path (m / purpose' / coin_type' / account' / change / address_index)
	* @param data
	* - data to be signed in raw bytes
	*
	* @returns
	* - signature holding R and S, totally 64 bytes
	*/
	async rawSign(rootKey, bip44Path, data, derivationType) {
		const raw = await this.deriveKey(rootKey, bip44Path, true, derivationType);
		const scalar = raw.slice(0, 32);
		const kR = raw.slice(32, 64);
		const publicKey = crypto_scalarmult_ed25519_base_noclamp(scalar);
		const r = crypto_core_ed25519_scalar_reduce(crypto_hash_sha512(Buffer.concat([kR, data])));
		const R = crypto_scalarmult_ed25519_base_noclamp(r);
		const S = crypto_core_ed25519_scalar_add(r, crypto_core_ed25519_scalar_mul(crypto_core_ed25519_scalar_reduce(crypto_hash_sha512(Buffer.concat([
			R,
			publicKey,
			data
		]))), scalar));
		return Buffer.concat([R, S]);
	}
	/**
	* Ref: https://datatracker.ietf.org/doc/html/rfc8032#section-5.1.6
	*
	*  Edwards-Curve Digital Signature Algorithm (EdDSA)
	*
	* @param context - context of the key (i.e Address, Identity)
	* @param account - account number. This value will be hardened as part of BIP44
	* @param keyIndex - key index. This value will be a SOFT derivation as part of BIP44.
	* @param data - data to be signed in raw bytes
	* @param metadata - metadata object that describes how `data` was encoded and what schema to use to validate against
	* @param derivationType
	* - BIP32 derivation type, defines if it's standard Ed25519 or Peikert's ammendment to BIP32-Ed25519
	*
	* @returns - signature holding R and S, totally 64 bytes
	* */
	async signData(rootKey, context, account, keyIndex, data, metadata, derivationType = BIP32DerivationType.Peikert) {
		const result = this.validateData(data, metadata);
		if (result instanceof Error) throw result;
		if (!result) throw ERROR_BAD_DATA;
		const bip44Path = GetBIP44PathFromContext(context, account, keyIndex);
		return await this.rawSign(rootKey, bip44Path, data, derivationType);
	}
	/**
	* Sign Algorand transaction
	* @param context
	* - context of the key (i.e Address, Identity)
	* @param account
	* - account number. This value will be hardened as part of BIP44
	* @param keyIndex
	* - key index. This value will be a SOFT derivation as part of BIP44.
	* @param prefixEncodedTx
	* - Encoded transaction object
	* @param derivationType
	* - BIP32 derivation type, defines if it's standard Ed25519 or Peikert's ammendment to BIP32-Ed25519
	*
	* @returns sig
	* - Raw bytes signature
	*/
	async signAlgoTransaction(rootKey, context, account, keyIndex, prefixEncodedTx, derivationType = BIP32DerivationType.Peikert) {
		const bip44Path = GetBIP44PathFromContext(context, account, keyIndex);
		return await this.rawSign(rootKey, bip44Path, prefixEncodedTx, derivationType);
	}
	/**
	* SAMPLE IMPLEMENTATION to show how to validate data with encoding and schema, using base64 as an example
	*
	* @param message
	* @param metadata
	* @returns
	*/
	validateData(message, metadata) {
		if (this.hasAlgorandTags(message)) return ERROR_TAGS_FOUND;
		let decoded;
		switch (metadata.encoding) {
			case Encoding.BASE64:
				decoded = new Uint8Array(Buffer.from(Buffer.from(message).toString(), "base64"));
				break;
			case Encoding.MSGPACK:
				decoded = import_dist.decode(message);
				break;
			case Encoding.NONE:
				decoded = message;
				break;
			default: throw Error("Invalid encoding");
		}
		const ajv = new import_ajv.default();
		const valid = ajv.compile(metadata.schema)(decoded);
		if (!valid) console.log(ajv.errors);
		return valid;
	}
	/**
	* Detect if the message has Algorand protocol specific tags
	*
	* @param message - raw bytes of the message
	* @returns - true if message has Algorand protocol specific tags, false otherwise
	*/
	hasAlgorandTags(message) {
		for (const prefix of [
			"appID",
			"arc",
			"aB",
			"aD",
			"aO",
			"aP",
			"aS",
			"AS",
			"B256",
			"BH",
			"BR",
			"CR",
			"GE",
			"KP",
			"MA",
			"MB",
			"MX",
			"NIC",
			"NIR",
			"NIV",
			"NPR",
			"OT1",
			"OT2",
			"PF",
			"PL",
			"Program",
			"ProgData",
			"PS",
			"PK",
			"SD",
			"SpecialAddr",
			"STIB",
			"spc",
			"spm",
			"spp",
			"sps",
			"spv",
			"TE",
			"TG",
			"TL",
			"TX",
			"VO"
		]) if (Buffer.from(message.subarray(0, prefix.length)).toString("ascii") === prefix) return true;
		return false;
	}
	/**
	* Wrapper around libsodium basica signature verification
	*
	* Any lib or system that can verify EdDSA signatures can be used
	*
	* @param signature - raw 64 bytes signature (R, S)
	* @param message - raw bytes of the message
	* @param publicKey - raw 32 bytes public key (x,y)
	* @returns true if signature is valid, false otherwise
	*/
	async verifyWithPublicKey(signature, message, publicKey) {
		return crypto_sign_verify_detached(signature, message, publicKey);
	}
	/**
	* Function to perform ECDH against a provided public key
	*
	* ECDH reference link: https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman
	*
	* It creates a shared secret between two parties. Each party only needs to be aware of the other's public key.
	* This symmetric secret can be used to derive a symmetric key for encryption and decryption. Creating a private channel between the two parties.
	*
	* @param context - context of the key (i.e Address, Identity)
	* @param account - account number. This value will be hardened as part of BIP44
	* @param keyIndex - key index. This value will be a SOFT derivation as part of BIP44.
	* @param otherPartyPub - raw 32 bytes public key of the other party
	* @param meFirst - defines the order in which the keys will be considered for the shared secret. If true, our key will be used first, otherwise the other party's key will be used first
	* @returns - raw 32 bytes shared secret
	*/
	async ECDH(rootKey, context, account, keyIndex, otherPartyPub, meFirst, derivationType = BIP32DerivationType.Peikert) {
		const bip44Path = GetBIP44PathFromContext(context, account, keyIndex);
		const scalar = (await this.deriveKey(rootKey, bip44Path, true, derivationType)).slice(0, 32);
		const ourPubCurve25519 = crypto_sign_ed25519_pk_to_curve25519(crypto_scalarmult_ed25519_base_noclamp(scalar));
		const otherPartyPubCurve25519 = crypto_sign_ed25519_pk_to_curve25519(otherPartyPub);
		const sharedPoint = crypto_scalarmult(scalar, otherPartyPubCurve25519);
		let concatenation;
		if (meFirst) concatenation = Buffer.concat([
			sharedPoint,
			ourPubCurve25519,
			otherPartyPubCurve25519
		]);
		else concatenation = Buffer.concat([
			sharedPoint,
			otherPartyPubCurve25519,
			ourPubCurve25519
		]);
		return crypto_generichash(32, new Uint8Array(concatenation));
	}
};
new XHDWalletAPI();
//#endregion
export { IntMode as C, require_nacl_fast as E, RawBinaryString as S, require_json_bigint as T, u32 as _, TransactionType as a, decode$1 as b, abool$1 as c, ahash as d, anumber$1 as f, swap32IfBE as g, createHasher as h, groupTransactions as i, abytes$2 as l, clean as m, Transaction as n, Address as o, aoutput as p, encodeTransactionRaw as r, sha256 as s, AlgodClient as t, aexists as u, split as v, require_base32 as w, encode as x, decode as y };
