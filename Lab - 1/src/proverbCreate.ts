const proverb = document.querySelector('#proverb');
proverb?.addEventListener('change', function() {
    localStorage.setItem("1", proverb?.innerHTML );
})

let proverbStorage = localStorage.setItem("1", "proverb" );