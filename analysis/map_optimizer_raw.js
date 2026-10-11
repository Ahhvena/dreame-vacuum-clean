var optimize = function (f, r, e, o, n) {
  var l,
    t,
    a = function (f, i, r) {
      for (var e, o, n, l, t, a; ;) {
        var u = void 0;
        for (e = 0; e < i; e++) {
          if (0 === f[e][0]) {
            u = [e, 0];
            break;
          }
          if (0 === f[e][r - 1]) {
            u = [e, r - 1];
            break;
          }
        }
        for (o = 0; o < r; o++) {
          if (0 === f[0][o]) {
            u = [0, o];
            break;
          }
          if (0 === f[i - 1][o]) {
            u = [i - 1, o];
            break;
          }
        }
        if (!u) break;
        for (n = [u[1], u[0]], l = 2; l;)
          ((a = n[--l]),
            (t = n[--l]),
            0 === f[a][t] && (f[a][t] = 100),
            t > 0 &&
              0 === f[a][t - 1] &&
              ((f[a][t - 1] = 100), (n[l++] = t - 1), (n[l++] = a)),
            t < r - 1 &&
              0 === f[a][t + 1] &&
              ((f[a][t + 1] = 100), (n[l++] = t + 1), (n[l++] = a)),
            a < i - 1 &&
              0 === f[a + 1][t] &&
              ((f[a + 1][t] = 100), (n[l++] = t), (n[l++] = a + 1)),
            a > 0 &&
              0 === f[a - 1][t] &&
              ((f[a - 1][t] = 100), (n[l++] = t), (n[l++] = a - 1)));
      }
      for (e = 0; e < i; e++)
        for (o = 0; o < r; o++)
          0 === f[e][o] ? (f[e][o] = 3) : 100 === f[e][o] && (f[e][o] = 0);
    },
    u = function (f, i, r, e) {
      var o, n, l, t, a;
      for (l = 0; l < r; l++)
        for (n = 0; n < i; n++)
          if (0 !== f[n][l]) {
            if (0 == l || l == r - 1 || 0 == n || n == i - 1) {
              f[n][l] = e;
              continue;
            }
            for (o = !1, t = n - 1; t <= n + 1; t++) {
              for (a = l - 1; a <= l + 1; a++)
                if (0 === f[t][a]) {
                  o = !0;
                  break;
                }
              if (o) break;
            }
            o && (f[n][l] = e);
          }
    },
    h = function (f, i, r, e) {
      var o, n, l, t, a, h, x, p, y;
      for (n = 0; n < i; n++)
        for (p = -1, o = 0; o < r; o++)
          if (((h = o - 1), f[n][o] !== e || o == r - 1)) {
            if (p >= 0) {
              if ((o == r - 1 && f[n][o] === e && (h = o), h == p)) {
                p = -1;
                continue;
              }
              for (
                y = 0, t = p;
                t <= h &&
                ((l = n - 1) >= 0 && f[l][t] === e && y++,
                (l = n + 1) < i && f[l][t] === e && y++,
                !(y > 2));
                t++
              );
              if (y > 2)
                for (t = p; t <= h; t++)
                  ((l = n - 1) >= 0 && 0 === f[l][t] && (f[l][t] = 1),
                    (l = n + 1) < i && 0 === f[l][t] && (f[l][t] = 1));
            }
            p = -1;
          } else p < 0 && (p = o);
      for (o = 0; o < r; o++)
        for (x = -1, n = 0; n < i; n++)
          if (((index = o * i + n), (a = n - 1), f[n][o] !== e || n == i - 1)) {
            if (x >= 0) {
              if ((f[n][o] === e && n == i - 1 && (a = n), a == x)) {
                x = -1;
                continue;
              }
              for (
                y = 0, l = x;
                l <= a &&
                ((t = o - 1) >= 0 && f[l][t] === e && y++,
                (t = o + 1) < i && f[l][t] === e && y++,
                !(y > 2));
                l++
              );
              if (y > 2)
                for (l = x; l <= a; l++)
                  ((t = o - 1) >= 0 && 0 === f[l][t] && (f[l][t] = 1),
                    (t = o + 1) < i && 0 === f[l][t] && (f[l][t] = 1));
            }
            x = -1;
          } else x < 0 && (x = n);
      for (n = 0; n < i; n++)
        for (o = 0; o < r; o++) f[n][o] === e && (f[n][o] = 1);
      u(f, i, r, e);
    },
    x = function (f, i, r) {
      var e = { p0: [], p1: [] };
      (f.h
        ? ((e.p0[1] = f.y),
          (e.p1[1] = f.y),
          f.fe
            ? ((e.p0[0] = f.x[0]), (e.p1[0] = f.x[1]))
            : ((e.p0[0] = f.x[1]), (e.p1[0] = f.x[0])),
          (e.length = Math.abs(f.x[1] - f.x[0])))
        : ((e.p0[0] = f.x),
          (e.p1[0] = f.x),
          (e.length = Math.abs(f.y[1] - f.y[0])),
          f.fe
            ? ((e.p0[1] = f.y[0]), (e.p1[1] = f.y[1]))
            : ((e.p0[1] = f.y[1]), (e.p1[1] = f.y[0]))),
        i.push(e),
        r.push(f));
    },
    p = function (f, i) {
      for (var r, e, o, n, l, t, a, u, h, p, y, s, v = []; ;) {
        for (r = void 0, s = 0; s < f.length; s++)
          if (null != (e = f[s])) {
            (delete f[s], (r = e));
            break;
          }
        if (null == r) break;
        for (r.fe = !0, x(r, (o = []), (n = [])); ;)
          if ((l = n[n.length - 1]).h) {
            for (t = !1, s = 0; s < i.length; s++)
              if (
                null != (a = i[s]) &&
                ((h = l.x[0]), l.fe && (h = l.x[1]), h == a.x)
              ) {
                if (l.y == a.y[0]) {
                  ((a.fe = !0), x(a, o, n), delete i[s], (t = !0));
                  break;
                }
                if (l.y == a.y[1]) {
                  ((a.fe = !1), x(a, o, n), delete i[s], (t = !0));
                  break;
                }
                if (l.y > a.y[0] && l.y < a.y[1]) {
                  (l.fe
                    ? 0 == z[h - 1][l.y + 1]
                      ? ((a.y[1] = l.y), (a.fe = !1))
                      : ((a.y[0] = l.y), (a.fe = !0))
                    : 0 == z[h + 1][l.y + 1]
                      ? ((a.y[1] = l.y), (a.fe = !1))
                      : ((a.y[0] = l.y), (a.fe = !0)),
                    x(a, o, n),
                    delete i[s],
                    (t = !0));
                  break;
                }
              }
            if (!t) break;
          } else {
            if (
              ((t = !1),
              (y = l.y[0]),
              l.fe && (y = l.y[1]),
              y == r.y && l.x == r.x[0])
            )
              break;
            for (s = 0; s < f.length; s++)
              if (
                (u = f[s]) &&
                ((p = l.y[0]), l.fe && (p = l.y[1]), p == u.y)
              ) {
                if (l.x == u.x[0]) {
                  ((u.fe = !0), x(u, o, n), delete f[s], (t = !0));
                  break;
                }
                if (l.x == u.x[1]) {
                  ((u.fe = !1), x(u, o, n), delete f[s], (t = !0));
                  break;
                }
                if (l.x > u.x[0] && l.x < u.x[1]) {
                  (l.fe
                    ? 0 == z[l.x - 1][p - 1]
                      ? ((u.x[0] = l.x), (u.fe = !0))
                      : ((u.x[1] = l.x), (u.fe = !1))
                    : 0 == z[l.x - 1][p + 1]
                      ? ((u.x[0] = l.x), (u.fe = !0))
                      : ((u.x[1] = l.x), (u.fe = !1)),
                    x(u, o, n),
                    delete f[s],
                    (t = !0));
                  break;
                }
              }
            if (!t) break;
          }
        var d = 0,
          c = o.length;
        for (s = 0; s < c; s++) d += o[s].length;
        v.push({ cl: o, al: n, length: d });
      }
      return v;
    },
    y = function (f, i) {
      if (f[0] >= i[1] || i[0] >= f[1]) return null;
      var r = [];
      return (
        (r = r.concat(f).concat(i)).sort(function (f, i) {
          return f - i;
        }),
        [r[1], r[2]]
      );
    },
    s = function (f, i, r, e) {
      var o,
        n,
        l,
        t = 0;
      for (
        r[0] > r[1] && ((o = r[0]), (r[0] = r[1]), (r[1] = o)),
          e[0] > e[1] && ((o = e[0]), (e[0] = e[1]), (e[1] = o)),
          n = r[0];
        n <= r[1];
        n++
      )
        for (l = e[0]; l <= e[1]; l++) f[n][l] && t++;
      var a = t / ((r[1] - r[0] + 1) * (e[1] - e[0] + 1));
      if (a > 0.5)
        for (n = r[0]; n <= r[1]; n++)
          for (l = e[0]; l <= e[1]; l++) i[n][l] = 1;
      return a;
    },
    v = function (f, i, r, e) {
      var o,
        n,
        l,
        t,
        a,
        u,
        h,
        x,
        p = e.ls[0],
        y = e.ls[e.ls.length - 1];
      if (2 == e.ls.length || e.ls.length > 22)
        return (
          (a = { ls: [], hd: 0, vd: 0 }).ls.push(y),
          y.h ? (a.hd = y.fe ? 6 : 8) : (a.vd = y.fe ? 7 : 5),
          a
        );
      if (
        (p.h
          ? (6 == e.hd ? (o = p.x[1]) : (l = p.x[0]),
            7 == e.vd ? (n = p.y) : (t = p.y),
            y.h
              ? (6 == e.hd ? (l = y.x[0]) : (o = y.x[1]),
                7 == e.vd ? (t = y.y) : (n = y.y))
              : (6 == e.hd ? (l = y.x) : (o = y.x),
                7 == e.vd ? (t = y.y[0]) : (n = y.y[1])))
          : (7 == e.vd ? (n = p.y[1]) : (t = p.y[0]),
            6 == e.hd ? (o = p.x) : (l = p.x),
            y.h
              ? (6 == e.hd ? (l = y.x[0]) : (o = y.x[1]),
                7 == e.vd ? (t = y.y) : (n = y.y))
              : (6 == e.hd ? (l = y.x) : (o = y.x),
                7 == e.vd ? (t = y.y[0]) : (n = y.y[1]))),
        null == o || null == n || null == l || null == t)
      )
        return (
          (a = { ls: [], hd: 0, vd: 0 }).ls.push(y),
          y.h ? (a.hd = y.fe ? 6 : 8) : (a.vd = y.fe ? 7 : 5),
          a
        );
      for (
        p.h && y.h && t - n <= 3
          ? 6 == e.hd
            ? ((o = p.x[0]), (l = y.x[1]))
            : ((o = y.x[0]), (l = p.x[1]))
          : !p.h &&
            !y.h &&
            l - o <= 3 &&
            (7 == e.vd
              ? ((n = p.y[0]), (t = y.y[1]))
              : ((n = y.y[0]), (t = p.y[1]))),
          u = 0,
          h = o;
        h <= l;
        h++
      )
        for (x = n; x <= t; x++) 0 === f[h][x] && u++;
      if (u < 20 || u < ((l - o + 1) * (t - n + 1) * 2) / 3)
        for (h = o; h <= l; h++)
          for (x = n; x <= t; x++) 0 === f[h][x] && (f[h][x] = r);
      return (
        (a = { ls: [], hd: 0, vd: 0 }).ls.push(y),
        y.h ? (a.hd = y.fe ? 6 : 8) : (a.vd = y.fe ? 7 : 5),
        a
      );
    },
    d = function (f, i, r, e, o) {
      var n,
        l,
        t,
        a,
        u,
        h = [],
        x = [];
      for (M = 0; M < i; M++)
        for (n = -1, m = 0; m < r; m++) {
          if (((t = m - 1), f[M][m] === e && m != r - 1)) {
            if (
              ((u = !1),
              ((M > 0 && f[M - 1][m] === e) ||
                (M < i - 1 && f[M + 1][m] === e)) &&
                (u = !0),
              n < 0 && u)
            ) {
              n = m;
              continue;
            }
            if (!u) continue;
            t = m;
          }
          if (n >= 0) {
            if ((m == r - 1 && f[M][m] === e && (t = m), t == n)) {
              n = -1;
              continue;
            }
            if (
              ((u = !1),
              ((M > 0 && f[M - 1][t] === e) ||
                (M < i - 1 && f[M + 1][t] === e)) &&
                (u = !0),
              u)
            ) {
              (x.push({ x: M, y: [n, t], h: !1, length: t - n }), (n = t));
              continue;
            }
          }
          n = -1;
        }
      for (m = 0; m < r; m++)
        for (l = -1, M = 0; M < i; M++) {
          if (((a = M - 1), f[M][m] === e && M != i - 1)) {
            if (
              ((u = !1),
              ((m > 0 && m > 0 && f[M][m - 1] === e) ||
                (m < r - 1 && f[M][m + 1] === e)) &&
                (u = !0),
              l < 0 && u)
            ) {
              l = M;
              continue;
            }
            if (!u) continue;
            a = M;
          }
          if (l >= 0) {
            if ((f[M][m] === e && M == i - 1 && (a = M), a == l)) {
              l = -1;
              continue;
            }
            if (
              ((u = !1),
              ((m > 0 && f[a][m - 1] === e) ||
                (m < r - 1 && f[a][m + 1] === e)) &&
                (u = !0),
              u)
            ) {
              (h.push({ x: [l, a], y: m, h: !0, length: a - l }), (l = a));
              continue;
            }
          }
          l = -1;
        }
      if (0 == h.length) return !1;
      var y,
        s,
        d,
        c,
        j,
        b,
        g,
        k,
        M,
        m,
        z = p(h, x),
        q = 0,
        w = [];
      for (M = 0; M < z.length; M++)
        (d = z[M]).length > q
          ? (y && q < 80 && w.push(y), (q = d.length), (y = d.cl), (s = d.al))
          : d.length < 80 && w.push(d.cl);
      if (o && w.length > 0) {
        for (c = [], M = 0; M < w.length; M++) c.push(w[M][0].p0);
        for (; c.length > 0;)
          for (f[(j = c.pop())[0]][j[1]] = 0, M = j[0] - 1; M <= j[0] + 1; M++)
            for (m = j[1] - 1; m <= j[1] + 1; m++)
              (M != j[0] && m != j[1]) ||
                (0 !== f[j[0]][j[1]] && c.push([M, m]));
      }
      var A = { ls: [], hd: 0, vd: 0 };
      for (M = 0; M <= s.length; M++)
        ((b = s[M]),
          M == s.length && (b = s[0]),
          0 == M
            ? (A.ls.push(b), (A.hd = 6))
            : (b.h
                ? ((g = b.fe ? 6 : 8),
                  0 != A.hd && A.hd != g && (A = v(f, 0, e, A)),
                  0 == A.hd && (A.hd = g),
                  A.ls.push(b))
                : ((k = b.fe ? 7 : 5),
                  0 != A.vd && A.vd != k && (A = v(f, 0, e, A)),
                  0 == A.vd && (A.vd = k),
                  A.ls.push(b)),
              (b.length >= 7 || M == s.length) && (A = v(f, 0, e, A))));
      return !0;
    },
    c = null != e,
    b = !1;
  n && (t = { x: n[0], y: n[1], a: n[2] });
  var g = r[2],
    k = r[3],
    M = r[4],
    m = 0,
    z = f.map(function (f) {
      return f.slice(0);
    });
  for (i = 0; i < g; i++)
    for (j = 0; j < k; j++)
      0 !== z[i][j] &&
        (255 === z[i][j]
          ? (z[i][j] = 2)
          : 253 === z[i][j]
            ? (z[i][j] = 1)
            : 250 === z[i][j] && (z[i][j] = 3),
        m++);
  if (
    ((l = z.map(function (f) {
      return f.slice(0);
    })),
    (function (f, i, r) {
      var e, o;
      for (e = 1; e < r - 1; e++)
        for (o = 1; o < i - 1; o++)
          if (1 === f[o][e]) {
            var n = 0;
            (1 !== f[o - 1][e] && n++,
              1 !== f[o + 1][e] && n++,
              1 !== f[o][e + 1] && n++,
              1 !== f[o][e - 1] && n++,
              n > 2 && (f[o][e] = 0));
          }
      for (e = 1; e < r - 1; e++)
        for (o = 1; o < i - 1; o++)
          2 === f[o][e] &&
            ((1 === f[o - 1][e] && 1 === f[o + 1][e]) ||
            (1 === f[o][e + 1] && 1 === f[o][e - 1])
              ? (f[o][e] = 1)
              : (f[o][e] = 0));
    })(z, g, k),
    (function (f, i, r, e) {
      a(f, i, r);
      var o, n, l, t, u, h, x, p, y, s, v;
      for (u = 0; u < 2; u++) {
        for (h = 0; h < i; h++)
          for (o = -1, l = !1, x = 0; x < r; x++)
            if (0 !== f[h][x]) {
              if (l && o >= 0) {
                if (x - o - 1 <= 3)
                  for (y = o + 1; y < x; y++) {
                    if (((t = 0), h > 0 && y > 0))
                      for (s = h - 1; s <= h + 1; s++)
                        for (v = y - 1; v <= y + 1; v++)
                          s != h &&
                            v != y &&
                            ((s != h && v != y) || (f[s][v] && t++));
                    else t = 5;
                    t >= 3 && (f[h][y] = e);
                  }
                l = !1;
              }
              o = x;
            } else o >= 0 && (l = !0);
        for (x = 0; x < r; x++)
          for (n = -1, l = !1, h = 0; h < i; h++)
            if (0 !== f[h][x]) {
              if (l && n >= 0) {
                if (h - n - 1 <= 3)
                  for (p = n + 1; p < h; p++) {
                    if (((t = 0), p > 0 && x > 0))
                      for (s = p - 1; s <= p + 1; s++)
                        for (v = x - 1; v <= x + 1; v++)
                          s != p &&
                            v != x &&
                            ((s != p && v != x) || (f[s][v] && t++));
                    else t = 5;
                    t >= 3 && (f[p][x] = e);
                  }
                l = !1;
              }
              n = h;
            } else n >= 0 && (l = !0);
      }
    })(z, g, k, 3),
    (function (f, i, r) {
      var e,
        o,
        n,
        l,
        t,
        a,
        u,
        h,
        x = f.map(function (f) {
          return f.slice(0);
        }),
        p = 20;
      for (l = 0; l < i; l++)
        for (e = -1, t = 0; t < r; t++)
          if (0 === f[l][t]) {
            if (-1 != e && t - e <= p) {
              if (
                ((n = !1), (0 == l || l == i - 1 || t - e <= 2) && (n = !0), !n)
              )
                for (a = l - 1, n = !0, h = e; h < t; h++)
                  if (1 === x[a][h]) {
                    n = !1;
                    break;
                  }
              if (!n)
                for (a = l + 1, n = !0, h = e; h < t; h++)
                  if (1 === x[a][h]) {
                    n = !1;
                    break;
                  }
              if (n) for (h = e; h < t; h++) f[l][h] = 0;
            }
            e = -1;
          } else e < 0 && (e = t);
      for (t = 0; t < r; t++)
        for (o = -1, l = 0; l < i; l++)
          if (((index = t * i + l), 0 === f[l][t])) {
            if (-1 != o && l - o <= p) {
              if (
                ((n = !1), (0 == t || t == r - 1 || l - o <= 2) && (n = !0), !n)
              )
                for (u = t - 1, n = !0, h = o; h < l; h++)
                  if (1 === x[h][u]) {
                    n = !1;
                    break;
                  }
              if (!n)
                for (u = t + 1, n = !0, h = o; h < l; h++)
                  if (1 === x[h][u]) {
                    n = !1;
                    break;
                  }
              if (n) for (h = o; h < l; h++) f[h][t] = 0;
            }
            o = -1;
          } else o < 0 && (o = l);
      for (p = 2, l = 0; l < i; l++)
        for (e = -1, t = 0; t < r; t++)
          if (0 === f[l][t]) {
            if (-1 != e && t - e <= p) for (h = e; h < t; h++) f[l][h] = 0;
            e = -1;
          } else e < 0 && (e = t);
      for (t = 0; t < r; t++)
        for (o = -1, l = 0; l < i; l++)
          if (((index = t * i + l), 0 === f[l][t])) {
            if (-1 != o && l - o <= p) for (h = o; h < l; h++) f[h][t] = 0;
            o = -1;
          } else o < 0 && (o = l);
    })(z, g, k),
    u(z, g, k, 5),
    h(z, g, k, 5),
    (function (f, i, r, e, o) {
      var n,
        l,
        t,
        x,
        v,
        d,
        c,
        j,
        b = [],
        g = [];
      for (c = 0; c < r; c++)
        for (x = -1, j = 0; j < e; j++) {
          if (((n = j - 1), i[c][j] === o && j != e - 1)) {
            if (
              ((t = !1),
              ((c > 0 && i[c - 1][j] === o) ||
                (c < r - 1 && i[c + 1][j] === o)) &&
                (t = !0),
              x < 0 && t)
            ) {
              x = j;
              continue;
            }
            if (!t) continue;
            n = j;
          }
          if (x >= 0) {
            if ((j == e - 1 && i[c][j] === o && (n = j), n == x)) {
              x = -1;
              continue;
            }
            if (
              ((t = !1),
              (d = 1),
              ((c > 0 && i[c - 1][n] === o) ||
                (c < r - 1 && i[c + 1][n] === o)) &&
                (t = !0),
              0 == c
                ? (d = 1)
                : c == r - 1
                  ? (d = 2)
                  : i[c - 1][n] === o
                    ? (d = i[c + 1][n] ? 1 : 2)
                    : i[c + 1][n] === o && (d = i[c - 1][n] ? 2 : 1),
              t)
            ) {
              (g.push({ x: c, y: [x, n], h: !1, d: d, length: n - x }),
                (x = n));
              continue;
            }
          }
          x = -1;
        }
      for (j = 0; j < e; j++)
        for (v = -1, c = 0; c < r; c++) {
          if (((l = c - 1), i[c][j] === o && c != r - 1)) {
            if (
              ((t = !1),
              ((j > 0 && i[c][j - 1] === o) ||
                (j < e - 1 && i[c][j + 1] === o)) &&
                (t = !0),
              v < 0 && t)
            ) {
              v = c;
              continue;
            }
            if (!t) continue;
            l = c;
          }
          if (v >= 0) {
            if ((i[c][j] === o && c == r - 1 && (l = c), l == v)) {
              v = -1;
              continue;
            }
            if (
              ((t = !1),
              (d = 3),
              ((j > 0 && i[l][j - 1] === o) ||
                (j < e - 1 && i[l][j + 1] === o)) &&
                (t = !0),
              0 == j
                ? (d = 4)
                : j == e - 1
                  ? (d = 3)
                  : i[l][j - 1] === o
                    ? (d = i[l][j + 1] ? 4 : 3)
                    : i[l][j + 1] === o && (d = i[l][j - 1] ? 3 : 4),
              t)
            ) {
              (b.push({ x: [v, l], y: j, h: !0, d: d, length: l - v }),
                (v = l));
              continue;
            }
          }
          v = -1;
        }
      for (
        var k, M, m, z, q, w, A, B, C, D = p(b, g), E = D.length > 1;
        D.length > 1;
      )
        for (k = D.shift().al, M = 0; M < k.length; M++)
          for (m = k[M], c = 0; c < D.length; c++)
            for (z = D[c].al, j = 0; j < z.length; j++)
              ((q = z[j]),
                !1 === m.h && !1 === q.h
                  ? m.d != q.d &&
                    ((m.x > q.x && 1 == m.d) || (m.x < q.x && 2 == m.d)) &&
                    Math.abs(m.x - q.x) <= 10 &&
                    null != (w = y(m.y, q.y)) &&
                    ((C = [m.x + 1, q.x - 1]),
                    m.x > q.x && (C = [q.x + 1, m.x - 1]),
                    s(f, i, C, w))
                  : !0 === m.h &&
                    !0 === q.h &&
                    m.d != q.d &&
                    ((m.y > q.y && 4 == m.d) || (m.y < q.y && 3 == m.d)) &&
                    Math.abs(m.y - q.y) <= 10 &&
                    null != (A = y(m.x, q.x)) &&
                    ((B = [m.y + 1, q.y - 1]),
                    m.y > q.y && (B = [q.y + 1, m.y - 1]),
                    s(f, i, A, B)));
      if (E) {
        for (c = 0; c < r; c++)
          for (j = 0; j < e; j++) i[c][j] === o && (i[c][j] = 1);
        (a(i, r, e), u(i, r, e, o), h(i, r, e, o));
      }
    })(l, z, g, k, 5),
    d(z, g, k, 5, !0))
  ) {
    if ((a(z, g, k), u(z, g, k, 6), t)) {
      var q = { x: t.x, y: t.y, a: t.a };
      q.x >= 0 &&
        q.x < g &&
        q.y >= 0 &&
        q.y < k &&
        0 !== z[Math.floor(q.x)][Math.floor(q.y)] &&
        ((q = (function (f, i, r, e, o) {
          var n,
            l,
            t,
            a,
            u,
            h,
            x,
            p,
            y,
            s,
            v,
            d,
            c,
            j,
            b,
            g,
            k = [],
            M = [];
          for (b = 0; b < i; b++)
            for (n = -1, g = 0; g < r; g++) {
              if (((t = g - 1), f[b][g] === e && g != r - 1)) {
                if (
                  ((u = !1),
                  ((b > 0 && f[b - 1][g] === e) ||
                    (b < i - 1 && f[b + 1][g] === e)) &&
                    (u = !0),
                  n < 0 && u)
                ) {
                  n = g;
                  continue;
                }
                if (!u) continue;
                t = g;
              }
              if (n >= 0) {
                if ((g == r - 1 && f[b][g] === e && (t = g), t == n)) {
                  n = -1;
                  continue;
                }
                if (
                  ((u = !1),
                  ((b > 0 && f[b - 1][t] === e) ||
                    (b < i - 1 && f[b + 1][t] === e)) &&
                    (u = !0),
                  u)
                ) {
                  (k.push({ p0: [b, n], p1: [b, t] }), (n = t));
                  continue;
                }
              }
              n = -1;
            }
          for (g = 0; g < r; g++)
            for (l = -1, b = 0; b < i; b++) {
              if (
                ((index = g * i + b), (a = b - 1), f[b][g] === e && b != i - 1)
              ) {
                if (
                  ((u = !1),
                  ((g > 0 && f[b][g - 1] === e) ||
                    (g < r - 1 && f[b][g + 1] === e)) &&
                    (u = !0),
                  l < 0 && u)
                ) {
                  l = b;
                  continue;
                }
                if (!u) continue;
                a = b;
              }
              if (l >= 0) {
                if ((f[b][g] === e && b == i - 1 && (a = b), a == l)) {
                  l = -1;
                  continue;
                }
                if (
                  ((u = !1),
                  ((g > 0 && f[a][g - 1] === e) ||
                    (g < r - 1 && f[a][g + 1] === e)) &&
                    (u = !0),
                  u)
                ) {
                  (M.push({ p0: [l, g], p1: [a, g] }), (l = a));
                  continue;
                }
              }
              l = -1;
            }
          if (
            ((h = Math.floor(o.x)),
            (x = Math.floor(o.y)),
            Math.abs(o.a - 180) <= 30)
          ) {
            for (o.a = 180, a = void 0, b = 0; b < k.length; b++)
              ((y = (p = k[b]).p0[0]),
                (v = p.p0[1] < p.p1[1] ? p.p0[1] : p.p1[1]),
                (d = p.p0[1] > p.p1[1] ? p.p0[1] : p.p1[1]),
                y >= h && x >= v && x <= d && (null == a || y < a) && (a = y));
            null != a && a - h <= 11 && ((o.a = 180), (o.x = a + 0.5));
          } else if (Math.abs(o.a - 360) <= 30 || Math.abs(o.a) <= 3) {
            for (o.a = 360, a = void 0, b = 0; b < k.length; b++)
              ((y = (p = k[b]).p0[0]),
                (v = p.p0[1] < p.p1[1] ? p.p0[1] : p.p1[1]),
                (d = p.p0[1] > p.p1[1] ? p.p0[1] : p.p1[1]),
                y <= h && x >= v && x <= d && (null == a || y > a) && (a = y));
            null != a && h - a <= 11 && ((o.a = 360), (o.x = a + 0.5));
          } else if (Math.abs(Math.abs(o.a - 270) <= 30)) {
            for (t = void 0, b = 0; b < M.length; b++)
              ((s = (p = M[b]).p0[1]),
                (c = p.p0[0] < p.p1[0] ? p.p0[0] : p.p1[0]),
                (j = p.p0[0] > p.p1[0] ? p.p0[0] : p.p1[0]),
                s >= x && h >= c && h <= j && (null == t || s < t) && (t = s));
            null != t && t - x <= 11 && ((o.a = 270), (o.y = t + 0.5));
          } else if (Math.abs(Math.abs(o.a - 90) <= 30)) {
            for (t = void 0, b = 0; b < M.length; b++)
              ((s = (p = M[b]).p0[1]),
                (c = p.p0[0] < p.p1[0] ? p.p0[0] : p.p1[0]),
                (j = p.p0[0] > p.p1[0] ? p.p0[0] : p.p1[0]),
                s <= x && h >= c && h <= j && (null == t || s > t) && (t = s));
            null != t && x - t <= 11 && ((o.a = 90), (o.y = t + 0.5));
          }
          return o;
        })(z, g, k, 6, q)),
        (t.x = q.x),
        (t.y = q.y),
        (t.a = q.a));
    }
    (d(z, g, k, 6), a(z, g, k), u(z, g, k, 7));
    var w = 0;
    if (c)
      for (
        (function (f, i, r, e) {
          var o, n, l, t, a;
          for (l = 0; l < r; l++)
            for (n = 0; n < i; n++)
              if (f[n][l] === e) {
                if (0 == l || l == r - 1 || 0 == n || n == i - 1) {
                  f[n][l] = 2;
                  continue;
                }
                for (o = !1, a = n - 1; a <= n + 1; a++) {
                  for (t = l - 1; t <= l + 1; t++)
                    if (f[a][t] !== e && 2 !== f[a][t]) {
                      o = !0;
                      break;
                    }
                  if (o) break;
                }
                o && (f[n][l] = 2);
              }
        })(z, g, k, 3),
          (function (f, i, r, e) {
            var o, n, l, t, a, u, h;
            for (h = 0; h < e; h++)
              for (u = 0; u < r; u++)
                for (a = 0; a < i; a++)
                  2 === f[a][u] &&
                    ((o = 0 == a ? 0 : f[a - 1][u]),
                    (n = a == i - 1 ? 0 : f[a + 1][u]),
                    (l = u == r - 1 ? 0 : f[a][u + 1]),
                    (t = 0 == u ? 0 : f[a][u - 1]),
                    ((0 == o && 2 == n) ||
                      (2 == o && 0 == n) ||
                      (0 == l && 2 == t) ||
                      (2 == l && 0 == t)) &&
                      (f[a][u] = 0));
          })(l, g, k, 2),
          i = 0;
        i < g;
        i++
      )
        for (j = 0; j < k; j++)
          ((value = z[i][j]),
            0 !== value &&
              (2 === value || 7 === value
                ? (z[i][j] = 255)
                : 3 === value
                  ? (z[i][j] = 0)
                  : (z[i][j] = 253),
              w++));
    else
      for (
        (function (f, i, r, e) {
          var o, n, l, t, a;
          for (t = 0; t < i; t++)
            for (n = -1, a = 0; a < r; a++)
              if (f[t][a] !== e) {
                if (-1 != n && a - n <= 3) for (o = n; o < a; o++) f[t][o] = 1;
                n = -1;
              } else n < 0 && (n = a);
          for (a = 0; a < r; a++)
            for (l = -1, t = 0; t < i; t++)
              if (f[t][a] !== e) {
                if (-1 != l && t - l <= 3) for (o = l; o < t; o++) f[o][a] = 1;
                l = -1;
              } else l < 0 && (l = t);
        })(z, g, k, 3),
          i = 0;
        i < g;
        i++
      )
        for (j = 0; j < k; j++)
          ((value = z[i][j]),
            value &&
              (w++,
              2 === value || 7 === value
                ? (z[i][j] = 255)
                : 3 === value
                  ? (z[i][j] = 250)
                  : (z[i][j] = 253)));
    (b = !((100 * w) / m < 50 && m > 2e3)) && (f = z);
  }
  if (c) {
    var A = r[0],
      B = r[1],
      C = A + g * M,
      D = B + k * M;
    (C < o[0] + o[2] * o[4] && (C = o[0] + o[2] * o[4]),
      D < o[1] + o[3] * o[4] && (D = o[1] + o[3] * o[4]),
      o[0] < A && (A = o[0]),
      o[1] < B && (B = o[1]),
      (g = (C - A) / o[4]),
      (k = (D - B) / o[4]));
    var E,
      F,
      G,
      H,
      I,
      J = (o[0] - A) / o[4],
      K = (o[1] - B) / o[4],
      L = J + o[2],
      N = K + o[3],
      O = (r[0] - A) / M,
      P = (r[1] - B) / M,
      Q = O + r[2],
      R = P + r[3],
      S = [];
    for (i = 0; i < g; i++)
      for (S[i] = [], j = 0; j < k; j++)
        ((E = j >= K && i >= J && j < N && i < L ? e[i - J][j - K] : 0),
          (F = j >= P && i >= O && j < R && i < Q ? f[i - O][j - P] : 0),
          (S[i][j] =
            0 != E && 255 != E
              ? E
              : 0 != F && 255 != F
                ? 254
                : 0 != F || 0 != E
                  ? 255
                  : 0));
    if (b)
      for (j = 0; j < k; j++)
        for (i = 0; i < g; i++)
          if (
            j >= P &&
            i >= O &&
            j < R &&
            i < Q &&
            2 === l[i - O][j - P] &&
            0 !== S[i][j]
          ) {
            for (I = !1, H = j - 3; H <= j + 3; H++)
              for (G = i - 3; G < i + 3; G++)
                if (!(H < 0 || G < 0 || H >= k || G >= g)) {
                  if (I) break;
                  if (255 === S[G][H]) {
                    I = !0;
                    break;
                  }
                }
            I || (S[i][j] = 251);
          }
    ((f = S), (r = [A, B, g, k]));
  }
  return [f, r, t ? [t.x, t.y, t.a] : []];
};
