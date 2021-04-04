let previous = document.querySelector("#prev");
let next = document.querySelector("#next");
function redirect(url) {
  window.location = url;
}
try {
  previous.onclick = function () {
    redirect(previous.dataset.url);
  };

}
catch (err) {
  console.log('prev button is missing.')
}
try {
    next.onclick = function () {
    redirect(next.dataset.url);
  };
}
catch (err) {
  console.log('next button is missing.')
}

/* toggle darkmode */

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }    
}
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}
