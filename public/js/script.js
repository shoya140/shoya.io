Array.from(document.querySelectorAll('.mail button'), function (e) {
  e.addEventListener('click', function () {
    const s = 'MBIS;eCMBCG;LOwAG;CFe=IG'
    var r = ''
    for (i = 0; i < s.length; i++) {
      r += String.fromCharCode((s.charCodeAt(i) + 5) % 93 + 33)
    }
    document.querySelector('.mail').innerHTML = r
  })
})

const query = 'a[href^="http"]:not([href*="' + location.hostname + '"])'
Array.from(document.querySelectorAll(query), function(e) {
  e.setAttribute('target', '_blank')
})
