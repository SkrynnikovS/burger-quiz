document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    'use strict';

    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const modalDialog = document.querySelector('.modal-dialog');
    const sendBtn = document.getElementById('send');
    const modalTitle = document.querySelector('.modal-title');




    // Firebase configuration
            const firebaseConfig = {
                apiKey: "AIzaSyBRfmFskmAkOGzn3mlO3t4xGGiqjdLP1Mk",
                authDomain: "burger-quiz-813ac.firebaseapp.com",
                databaseURL: "https://burger-quiz-813ac.firebaseio.com",
                projectId: "burger-quiz-813ac",
                storageBucket: "burger-quiz-813ac.appspot.com",
                messagingSenderId: "3955163237",
                appId: "1:3955163237:web:b55002ecd00f95edd6468c",
                measurementId: "G-6JLHNE9VM1"
                };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig); 
            


//получение данных json
    function getData () {
        formAnswers.textContent = 'LOAD'

        nextBtn.classList.add('d-none')
        prevBtn.classList.add('d-none')

        setTimeout(() => {
            firebase.database().ref().child('questions').once('value')
            .then(snap => playTest(snap.val()))
        }, 1000);
    }




//анимация модального окна
    let count = -100

    modalDialog.style.top = count + '%'

    function animateModal () {
        modalDialog.style.top = count + '%'
        count += 3

        if(count < 0) {
            requestAnimationFrame(animateModal)
        }else {
            count = -100
        }
    }

//адаптив и бургер-меню
    let clientWidth = document.documentElement.clientWidth;

    if(clientWidth < 768) {
        burgerBtn.style.display = 'flex';
    }else {
        burgerBtn.style.display = 'none';
    };

    window.addEventListener('resize', function() {
        clientWidth = document.documentElement.clientWidth
        if(clientWidth < 768) {
            burgerBtn.style.display = 'flex';
        }else {
            burgerBtn.style.display = 'none';
        }
    });


//обработчики событий

    burgerBtn.addEventListener('click', function() {
        burgerBtn.classList.add('active');
        requestAnimationFrame(animateModal)
        modalBlock.classList.add('d-block');
        playTest()
    });

    btnOpenModal.addEventListener('click', function() {
        requestAnimationFrame(animateModal)
        modalBlock.classList.add('d-block');
        getData () 
    })

    closeModal.addEventListener('click', function(){
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    });


//закрытие модального окна по клику вне
    document.addEventListener('click', function(event) {
        if(
            !event.target.closest('.modal-dialog ') &&
            !event.target.closest('.openModalButton') &&
            !event.target.closest('.burger')
            ) {
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
        }
    });




    function playTest(questions) {

        const finalAnswers = []
        let numberQuestion = 0
        const obj = {}

        modalTitle.textContent = 'modalTitle'

        function renderAnswers(index) {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement(`div`)

                answerItem.classList.add('answers-item', 'd-flex', 'flex-column', 'justify-content-center')
                answerItem.innerHTML = `
                        <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value = "${answer.title}">
                        <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src=${answer.url} alt="burger">
                        <span>${answer.title}</span>
                        </label>
                `
                formAnswers.appendChild(answerItem)
            })
        }


        function renderQuestions (indexQuestion){
            formAnswers.innerHTML = ``

            switch (true) {
                case (numberQuestion >= 0 && numberQuestion <= questions.length - 1):
                    questionTitle.textContent = `${questions[indexQuestion].question}`;
                    renderAnswers(indexQuestion);
                    nextBtn.classList.remove('d-none');
                    prevBtn.classList.remove('d-none');
                    sendBtn.classList.add('d-none');
                    if (numberQuestion === 0) {
                        prevBtn.classList.add('d-none');
                    }
                    break;

                case (numberQuestion === questions.length):
                    questionTitle.textContent = '';
                    modalTitle.textContent = '';
                    nextBtn.classList.add('d-none');
                    prevBtn.classList.add('d-none');
                    sendBtn.classList.remove('d-none');
                    formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="numberPhone">Введите номер телефона</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                    `;
                    const numberPhone = document.querySelector('#numberPhone');
                    numberPhone.addEventListener('input', (event) => {
                        event.target.value = event.target.value.replace(/[^0-9+-]/, '');
                    });
                    break;

                case (numberQuestion === questions.length + 1):
                    formAnswers.textContent = 'Спасибо за пройденный тест!';
                    for (let key in obj) {
                        let newObj = {};
                        newObj[key] = obj[key];
                        finalAnswers.push(newObj);
                    }
                    sendBtn.classList.add('d-none');
                    setTimeout(() => {
                        modalBlock.classList.remove('d-block');
                        burgerBtn.classList.remove('active');
                    }, 2000);
                    break;
            }
        }

        renderQuestions(numberQuestion);

        function checkAnswer () {
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone')

            inputs.forEach((input, index) => {
                if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }

                if (numberQuestion === questions.length) {
                    obj['Номер телефона'] = input.value;
                }
            })

            
        }

        nextBtn.onclick = () => {
            checkAnswer()
            numberQuestion++
            renderQuestions(numberQuestion)
        }
        
        prevBtn.onclick = () => {
            numberQuestion--
            renderQuestions(numberQuestion)
        }
        
        sendBtn.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            firebase
                .database()
                .ref()
                .child('contacts')
                .push(finalAnswers)
        }

    };
    

















});



















