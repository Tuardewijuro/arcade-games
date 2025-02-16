document.getElementById('piedra').addEventListener('click', () => playGame('piedra'));
document.getElementById('papel').addEventListener('click', () => playGame('papel'));
document.getElementById('tijera').addEventListener('click', () => playGame('tijera'));

const iconMap = {
    piedra: '<i class="fas fa-hand-rock"></i>',
    papel: '<i class="fas fa-hand-paper"></i>',
    tijera: '<i class="fas fa-hand-scissors"></i>'
};

const classMap = {
    piedra: 'piedra',
    papel: 'papel',
    tijera: 'tijera'
};

function playGame(userChoice) {
    document.getElementById('game-options').style.display = 'none';

    fetch('/api/games/piedra-papel-tijera', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userChoice })
    })
    .then(response => response.json())
    .then(data => {
        const userChoiceElement = document.getElementById('user-choice-img');
        const opponentChoiceElement = document.getElementById('opponent-choice-img');

        userChoiceElement.className = 'choice-text';
        opponentChoiceElement.className = 'choice-text';

        userChoiceElement.classList.add(classMap[data.userChoice]);
        opponentChoiceElement.classList.add(classMap[data.opponentChoice]);

        userChoiceElement.innerHTML = `${iconMap[data.userChoice]} ${data.userChoice.charAt(0).toUpperCase() + data.userChoice.slice(1)}`;
        opponentChoiceElement.innerHTML = `${iconMap[data.opponentChoice]} ${data.opponentChoice.charAt(0).toUpperCase() + data.opponentChoice.slice(1)}`;

        document.getElementById('game-result').innerText = data.result;

        document.getElementById('result').style.display = 'block';

        document.getElementById('restart').style.display = 'inline-block';
    });
}

document.getElementById('restart').addEventListener('click', () => {
    document.getElementById('game-options').style.display = 'flex';
    document.getElementById('result').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
});