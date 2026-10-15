/* Contador de Folhas — adaptador local para GitHub Pages.
   Substitui a base de dados do Claude (window.claude.use('db' | 'user')) por armazenamento
   no próprio browser (localStorage). Na primeira abertura carrega data/cartolinas.json.
   Modo responsável: abrir com ?admin=1 (fica memorizado); ?admin=0 para sair. */
(function () {
  var KEY = 'cf_db_v1', ADMIN = 'cf_admin';
  var listeners = [];

  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function write(store) {
    try { localStorage.setItem(KEY, JSON.stringify(store)); }
    catch (e) { throw { code: 'quota_exceeded' }; }
    notify();
  }
  function clone(x) { return x == null ? x : JSON.parse(JSON.stringify(x)); }
  function notify() { listeners.forEach(function (l) { try { l(); } catch (e) {} }); }
  window.addEventListener('storage', function (e) { if (e.key === KEY) notify(); });

  function snapDoc(id, data) { return { id: id, exists: data !== undefined, data: function () { return clone(data); } }; }

  // Carga inicial a partir de data/cartolinas.json
  var ready = (function () {
    var s = read();
    if (s['bd/meta']) return Promise.resolve();
    return fetch('data/cartolinas.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) {
        var s2 = read(), v = j.meta.versao;
        s2['bd/c_' + v + '_0'] = { versao: v, idx: 0, linhas: j.linhas };
        s2['bd/meta'] = Object.assign({}, j.meta, { partes: 1 });
        localStorage.setItem(KEY, JSON.stringify(s2));
      })
      .catch(function (e) { console.warn('Sem dados iniciais:', e); });
  })();

  function docsIn(col) {
    var s = read(), out = [], pre = col + '/';
    Object.keys(s).forEach(function (k) {
      if (k.indexOf(pre) === 0 && k.slice(pre.length).indexOf('/') < 0) out.push(snapDoc(k.slice(pre.length), s[k]));
    });
    return out;
  }

  function query(col, order, lim) {
    function run() {
      var d = docsIn(col);
      if (order) d.sort(function (a, b) {
        var x = a.data()[order.f], y = b.data()[order.f], c = x < y ? -1 : x > y ? 1 : 0;
        return order.dir === 'desc' ? -c : c;
      });
      if (lim) d = d.slice(0, lim);
      return { docs: d, size: d.length, empty: !d.length };
    }
    return {
      orderBy: function (f, dir) { return query(col, { f: f, dir: dir }, lim); },
      limit: function (n) { return query(col, order, n); },
      get: function () { return ready.then(run); },
      onSnapshot: function (cb, err) {
        var l = function () { try { cb(run()); } catch (e) { if (err) err(e); } };
        ready.then(function () { listeners.push(l); l(); });
        return function () { listeners = listeners.filter(function (x) { return x !== l; }); };
      }
    };
  }

  function doc(path) {
    function get() { return snapDoc(path.split('/').pop(), read()[path]); }
    return {
      id: path.split('/').pop(),
      get: function () { return ready.then(get); },
      set: function (data) { return ready.then(function () { var s = read(); s[path] = clone(data); write(s); }); },
      update: function (data) {
        return ready.then(function () {
          var s = read(); if (!s[path]) throw { code: 'not_found' };
          s[path] = Object.assign({}, s[path], clone(data)); write(s);
        });
      },
      delete: function () { return ready.then(function () { var s = read(); delete s[path]; write(s); }); },
      onSnapshot: function (cb, err) {
        var l = function () { try { cb(get()); } catch (e) { if (err) err(e); } };
        ready.then(function () { listeners.push(l); l(); });
        return function () { listeners = listeners.filter(function (x) { return x !== l; }); };
      }
    };
  }

  function collection(col) {
    var q = query(col);
    q.doc = function (id) { return doc(col + '/' + id); };
    q.add = function (data) {
      var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      return doc(col + '/' + id).set(data).then(function () { return { id: id }; });
    };
    return q;
  }

  var db = { collection: collection, doc: doc };

  // Modo responsável (mostra separadores Pedidos e Base de dados)
  try {
    var p = new URLSearchParams(location.search).get('admin');
    if (p === '1') localStorage.setItem(ADMIN, '1');
    if (p === '0') localStorage.removeItem(ADMIN);
  } catch (e) {}
  var isAdmin = false; try { isAdmin = localStorage.getItem(ADMIN) === '1'; } catch (e) {}

  var user = {
    id: function () { return Promise.resolve('local'); },
    canEdit: function () { return Promise.resolve(isAdmin); },
    profiles: function (ids) { var o = {}; ids.forEach(function (i) { o[i] = { name: i === 'local' ? 'Este dispositivo' : i }; }); return Promise.resolve(o); }
  };

  window.claude = window.claude || {};
  window.claude.use = function (name) {
    return Promise.resolve(name === 'db' ? db : name === 'user' ? user : null);
  };
})();
