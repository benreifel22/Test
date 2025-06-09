console.log('Codex is alive!');

document.addEventListener('DOMContentLoaded', () => {
  const greeting = document.getElementById('greeting');
  greeting.addEventListener('click', () => {
    greeting.style.color = 'skyblue';
  });
});
