/* global acquireVsCodeApi, document, window */
(function () {
  var vscode = acquireVsCodeApi();
  var container = document.getElementById('messages');
  var autoScroll = true;
  var activeFilter = 'all';
  var activeChunkGroup = null;
  var activeChunkText = '';
  var activeChunkData = null;
  var colorCache = {};
  var PALETTE = [
    { bg: '#4fc3f7', fg: '#000' },
    { bg: '#ab47bc', fg: '#fff' },
    { bg: '#66bb6a', fg: '#000' },
    { bg: '#ffa726', fg: '#000' },
    { bg: '#29b6f6', fg: '#000' },
    { bg: '#ef5350', fg: '#fff' },
    { bg: '#7e57c2', fg: '#fff' },
    { bg: '#8d6e63', fg: '#fff' },
    { bg: '#26a69a', fg: '#000' },
    { bg: '#ec407a', fg: '#fff' },
    { bg: '#5c6bc0', fg: '#fff' },
    { bg: '#9ccc65', fg: '#000' },
  ];

  function badgeColor(category) {
    if (colorCache[category]) return colorCache[category];
    var hash = 0;
    for (var i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) | 0;
    var idx = ((hash % PALETTE.length) + PALETTE.length) % PALETTE.length;
    colorCache[category] = PALETTE[idx];
    return colorCache[category];
  }

  var seenCategories = {};
  var dynamicFilters = document.getElementById('dynamicFilters');

  function ensureFilterButton(category) {
    if (seenCategories[category]) return;
    seenCategories[category] = true;
    var btn = document.createElement('button');
    btn.dataset.filter = category;
    btn.textContent = category;
    var colors = badgeColor(category);
    btn.style.borderBottom = '2px solid ' + colors.bg;
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-filter]').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      activeFilter = category;
      applyFilter();
    });
    dynamicFilters.appendChild(btn);
  }

  document.querySelectorAll('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-filter]').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilter();
    });
  });

  document.getElementById('clearBtn').addEventListener('click', function () {
    vscode.postMessage({ type: 'clear' });
    setEmptyState('Cleared. Waiting for ACP messages\u2026');
    activeChunkGroup = null;
    activeChunkText = '';
    activeChunkData = null;
    while (dynamicFilters.firstChild) dynamicFilters.removeChild(dynamicFilters.firstChild);
    seenCategories = {};
  });

  document.getElementById('scrollBtn').addEventListener('click', function () {
    autoScroll = !autoScroll;
    document.getElementById('scrollBtn').classList.toggle('active', autoScroll);
  });

  function setEmptyState(text) {
    while (container.firstChild) container.removeChild(container.firstChild);
    var div = document.createElement('div');
    div.className = 'empty';
    div.textContent = text;
    container.appendChild(div);
  }

  function applyFilter() {
    container.querySelectorAll('.msg-group').forEach(function (g) {
      var cat = g.dataset.category;
      g.style.display = activeFilter === 'all' || cat === activeFilter ? '' : 'none';
    });
  }

  function formatTime(ts) {
    var d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour12: false }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
  }

  function formatJson(value) {
    if (typeof value === 'string') return value;
    return JSON.stringify(value, null, 2) || '';
  }

  function createSpan(cls, text) {
    var el = document.createElement('span');
    el.className = cls;
    el.textContent = text;
    return el;
  }

  function isChunkMessage(msg) {
    if (msg.category !== 'sessionUpdate' || msg.direction !== 'incoming') return false;
    try {
      var args = Array.isArray(msg.data) ? msg.data[0] : msg.data;
      var update = args && args.update;
      return update && update.sessionUpdate === 'agent_message_chunk';
    } catch {
      return false;
    }
  }

  function extractChunkText(data) {
    try {
      var args = Array.isArray(data) ? data[0] : data;
      return args.update.content.text || '';
    } catch {
      return '';
    }
  }

  function buildRow(msg, colors) {
    var row = document.createElement('div');
    row.className = 'row';
    row.appendChild(createSpan('ts', formatTime(msg.timestamp)));
    row.appendChild(createSpan('dir', msg.direction === 'outgoing' ? '\u2192' : '\u2190'));
    var badge = createSpan('badge', msg.category);
    badge.style.background = colors.bg;
    badge.style.color = colors.fg;
    row.appendChild(badge);
    row.appendChild(createSpan('method', msg.method));
    row.appendChild(createSpan('dur', msg.durationMs != null ? Math.round(msg.durationMs) + 'ms' : ''));
    return row;
  }

  function buildPayload(data) {
    var payload = document.createElement('div');
    payload.className = 'payload';
    var pre = document.createElement('pre');
    pre.textContent = formatJson(data);
    payload.appendChild(pre);
    return payload;
  }

  function addMessage(msg) {
    var isChunk = isChunkMessage(msg);

    if (isChunk) {
      var text = extractChunkText(msg.data);
      if (activeChunkGroup) {
        activeChunkText += text;
        activeChunkData.update.content.text = activeChunkText;
        var pre = activeChunkGroup.querySelector('.payload pre');
        if (pre) pre.textContent = formatJson(activeChunkData);
        if (autoScroll) container.scrollTop = container.scrollHeight;
        return;
      }
      activeChunkText = text;
      activeChunkData = JSON.parse(JSON.stringify(Array.isArray(msg.data) ? msg.data[0] : msg.data));
    } else {
      activeChunkGroup = null;
      activeChunkText = '';
      activeChunkData = null;
    }

    var empty = container.querySelector('.empty');
    if (empty) empty.remove();

    ensureFilterButton(msg.category);

    var group = document.createElement('div');
    group.className = 'msg-group';
    group.dataset.category = msg.category;

    var colors = badgeColor(msg.category);
    var row = buildRow(msg, colors);
    var payload = isChunk ? buildPayload(activeChunkData) : buildPayload(msg.data);

    if (isChunk) activeChunkGroup = group;

    row.addEventListener('click', function () {
      payload.classList.toggle('open');
    });
    group.appendChild(row);
    group.appendChild(payload);
    container.appendChild(group);

    if (activeFilter !== 'all' && msg.category !== activeFilter) {
      group.style.display = 'none';
    }
    if (autoScroll) container.scrollTop = container.scrollHeight;
  }

  window.addEventListener('message', function (e) {
    var data = e.data;
    if (data.type === 'newMessage') {
      addMessage(data.message);
    } else if (data.type === 'history') {
      while (container.firstChild) container.removeChild(container.firstChild);
      activeChunkGroup = null;
      activeChunkText = '';
      activeChunkData = null;
      while (dynamicFilters.firstChild) dynamicFilters.removeChild(dynamicFilters.firstChild);
      seenCategories = {};
      if (!data.messages || data.messages.length === 0) {
        setEmptyState('No messages yet. Waiting for ACP messages\u2026');
      } else {
        data.messages.forEach(addMessage);
      }
    }
  });

  vscode.postMessage({ type: 'getHistory' });
})();
