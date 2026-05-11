var q2sel = [];
var q6sel = '';
var ans = {};
var TOTAL = 7;

function go(n) {
  var all = document.querySelectorAll('.card');
  for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
  var t = (n === TOTAL) ? document.getElementById('synthesis-card') : document.getElementById('card-' + n);
  if (t) t.classList.add('active');
  for (var j = 0; j < TOTAL; j++) {
    var d = document.getElementById('dot-' + j);
    if (!d) continue;
    d.className = 'step-dot';
    if (j < n) d.classList.add('done');
    else if (j === n) d.classList.add('active');
  }
  window.scrollTo(0, 0);
}

function val(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function fin(s) {
  if (!s) return '';
  s = s.trim();
  var c = s[s.length - 1];
  if (c !== '.' && c !== '!' && c !== '?') s += '.';
  return s;
}

function maj(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
function min(s) { return s ? s[0].toLowerCase() + s.slice(1) : ''; }

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

window.addEventListener('load', function() {

  document.getElementById('n0').addEventListener('click', function() { ans.q1 = val('q1'); go(1); });
  document.getElementById('p1').addEventListener('click', function() { go(0); });
  document.getElementById('n1').addEventListener('click', function() { go(2); });
  document.getElementById('p2').addEventListener('click', function() { go(1); });
  document.getElementById('n2').addEventListener('click', function() { ans.q3 = val('q3'); go(3); });
  document.getElementById('p3').addEventListener('click', function() { go(2); });
  document.getElementById('n3').addEventListener('click', function() { ans.q4 = val('q4'); go(4); });
  document.getElementById('p4').addEventListener('click', function() { go(3); });
  document.getElementById('n4').addEventListener('click', function() { ans.q5 = val('q5'); go(5); });
  document.getElementById('p5').addEventListener('click', function() { go(4); });
  document.getElementById('n5').addEventListener('click', function() { go(6); });
  document.getElementById('p6').addEventListener('click', function() { go(5); });

  var q2chips = document.querySelectorAll('#q2-chips .chip');
  for (var i = 0; i < q2chips.length; i++) {
    q2chips[i].addEventListener('click', function() {
      var v = this.getAttribute('data-v');
      var isAutre = this.getAttribute('data-autre') === '1';
      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        if (!isAutre) q2sel = q2sel.filter(function(x) { return x !== v; });
      } else {
        this.classList.add('selected');
        if (!isAutre && v) q2sel.push(v);
      }
      var hasAutre = document.querySelector('#q2-chips .chip[data-autre="1"].selected');
      var ad = document.getElementById('q2-autre');
      if (hasAutre) ad.classList.add('visible'); else ad.classList.remove('visible');
    });
  }

  var q6chips = document.querySelectorAll('#q6-chips .chip');
  for (var i = 0; i < q6chips.length; i++) {
    q6chips[i].addEventListener('click', function() {
      for (var k = 0; k < q6chips.length; k++) q6chips[k].classList.remove('selected');
      this.classList.add('selected');
      q6sel = this.getAttribute('data-v');
    });
  }

  document.getElementById('generate').addEventListener('click', function() {
    var pseudo = val('q7-pseudo') || 'Anonyme';
    var ville = val('q7-ville');
    var sig = ville ? pseudo + ', ' + ville : pseudo;

    var autreVal = val('q2-autre-val');
    var q2 = q2sel.slice();
    if (autreVal) q2.push(autreVal);

    var q1 = ans.q1 || '';
    var q3 = ans.q3 || '';
    var q4 = ans.q4 || '';
    var q5 = ans.q5 || '';

    var phrases = [];

    if (q2.length > 0 && q1) {
      var liste = q2.length === 1 ? q2[0] : q2.slice(0,-1).join(', ') + ' et ' + q2[q2.length-1];
      phrases.push("C'est pour " + liste + " que j'ai pris rendez-vous avec Isabelle — et aujourd'hui, " + min(fin(q1)));
    } else if (q2.length > 0) {
      var liste = q2.length === 1 ? q2[0] : q2.slice(0,-1).join(', ') + ' et ' + q2[q2.length-1];
      phrases.push("J'ai pris rendez-vous avec Isabelle pour " + liste + ".");
    } else if (q1) {
      phrases.push(maj(fin(q1)));
    }

    if (q5) {
      phrases.push(pick(["Pendant cette seance, ","Tout au long de la seance, ","Des le debut, "]) + min(fin(q5)));
    }

    if (q4) {
      phrases.push(pick(["Ce qui m'a particulierement touche(e) : ","Je repars avec quelque chose de precieux — ","Isabelle m'a transmis : "]) + min(fin(q4)));
    }

    if (q3) {
      phrases.push(pick(["Depuis, dans mon quotidien, ","Au fil des jours, ","Les effets se sont fait sentir : "]) + min(fin(q3)));
    }

    if (q6sel === 'oui-absolu') phrases.push("Je recommande Isabelle chaleureusement, sans la moindre hesitation.");
    else if (q6sel === 'oui') phrases.push("Je recommande Isabelle avec plaisir.");
    else if (q6sel === 'peut-etre') phrases.push("Pour ceux et celles qui cherchent une ecoute profonde, cette approche vaut le detour.");

    var txt = '';
    if (phrases.length >= 1) txt += phrases.slice(0,2).join(' ');
    if (phrases.length >= 3) txt += '\n\n' + phrases.slice(2,4).join(' ');
    if (phrases.length >= 5) txt += '\n\n' + phrases.slice(4).join(' ');
    txt += '\n\n\u2014 ' + sig;

    document.getElementById('synthesis-text').textContent = txt.trim();
    go(TOTAL);
  });

  document.getElementById('copy-btn').addEventListener('click', function() {
    var t = '\u2605\u2605\u2605\u2605\u2605\n' + document.getElementById('synthesis-text').textContent;
    var btn = this;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(t).then(function() {
        btn.textContent = 'Copie !';
        setTimeout(function() { btn.textContent = 'Copier mon temoignage'; }, 2500);
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      btn.textContent = 'Copie !';
      setTimeout(function() { btn.textContent = 'Copier mon temoignage'; }, 2500);
    }
  });

  document.getElementById('restart').addEventListener('click', function() {
    q2sel = []; q6sel = ''; ans = {};
    document.querySelectorAll('.chip').forEach(function(c) { c.classList.remove('selected'); });
    document.querySelectorAll('.autre-input').forEach(function(d) { d.classList.remove('visible'); });
    document.querySelectorAll('textarea, input[type=text]').forEach(function(e) { e.value = ''; });
    go(0);
  });

});
