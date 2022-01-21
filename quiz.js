//ссылки на глобальные элементы
let parent = document.querySelector(".test");
let img = document.querySelector(".picture");
let button = document.querySelector(".next");
let title = document.querySelector(".title");
let shortDes = document.querySelector(".shortDes");
let textScore = document.querySelector(".score");
let question;
let textOfQuestion;
let answers;
let arrOfAnswers;
let maxScore;

//глобальные переменные
let arrOfQuestions;
let numberOfQuestions;
let questionNumber;
let correctAnswer;
let score;
let pointsQuestion;

//функции событий для основной кнопки
function mouseNext() {this.classList.toggle("nextMouseover");}
function clickCreateFirstQuestion(){createFirstQuestion(); this.removeEventListener('click', clickCreateFirstQuestion);}
function clickCreateNewWindow(){CreateNewWindow(); this.removeEventListener('click', clickCreateNewWindow);}
function clickStart(){startQuiz(); this.removeEventListener('click', clickStart);}

//функции событий кнопкам ответов
function mouseButtonAns() {this.classList.toggle("answerMouseover");}

//вспомогательные маленькие функции
;(function(){startQuiz();})();
function writeQuestionNumber(){textScore.innerHTML = questionNumber + "/" + numberOfQuestions;}
function shuffle(array) {array.sort(() => Math.random() - 0.5);}
function createIcon(parentAns) {icon = document.createElement("img"); icon.classList.add("icon"); parentAns.appendChild(icon);}
function useInformationFromJSON(obj){
  //присваение данных из JSON
  for (let key in obj){
    if (key === "img"){
      img.src = obj[key];  
    }

    if (key === "title"){
      title.innerHTML = obj[key];
    }

    if (key === "shortdes"){
      shortDes.innerHTML = obj[key];
    }
}
}

//функция создания начального окна
function startQuiz() {
  //чтение из main.json
  let obj = JSON.parse(main);  

  //настройка кнопки
  button.disabled = false;
  button.innerHTML = "Начать";
  button.addEventListener("mouseover", mouseNext);
  button.addEventListener("mouseout",  mouseNext);
  button.addEventListener("click", clickCreateFirstQuestion);
  useInformationFromJSON(obj);

  //обнуление данных
  arrOfQuestions = [];
  numberOfQuestions = 0;
  questionNumber = 0;
  score = 0;
  arrOfAnswers = [];
  maxScore = 0;

  //предварительные настройки
  textScore.innerHTML = "Hi!";
}

//функция создания окна первого вопроса
function createFirstQuestion(){
  //чтение из questions.json
  arrOfQuestions = JSON.parse(questions);

  //подсчёт количества вопросов
  for (let elem of arrOfQuestions){ numberOfQuestions++;}

  //номер вопроса
  questionNumber++;

  //вывод номера текущего вопроса
  writeQuestionNumber();

  //удаление лишних элементов
  parent.removeChild(title);
  parent.removeChild(shortDes);

  //создание вопроса
  question = document.createElement("p");
  question.classList.add("question");
  parent.appendChild(question)
  textOfQuestion = document.createElement("SPAN");
  question.appendChild(textOfQuestion);

  //настройка кнопки
  button.classList.add("nextBottom");
  button.classList.add("nextNotActive");
  button.disabled = true;
  button.innerHTML = "Дальше";

  //создание контейнера для кнопок
  answers = document.createElement("div");
  answers.classList.add("answers");
  parent.appendChild(answers);

  //присваеваем данные из первого объекта
  let firstObj = arrOfQuestions[0];
  for (let key in firstObj){
    if (key === "img"){
      img.src =  firstObj[key];    
    }

    if (key === "question"){
      textOfQuestion.innerHTML = firstObj[key];
    }

    if (key === "score"){
      pointsQuestion = Number(firstObj[key]);
    }

    if (key === "answers"){
      let arrOfValue = firstObj[key];
      correctAnswer = arrOfValue[0];
      let buttonAns;
      shuffle(arrOfValue);
      for (let value of arrOfValue){
        //создание кнопки
        buttonAns = document.createElement('button');
        buttonAns.classList.add("answer");
        answers.appendChild(buttonAns);
        buttonAns.innerHTML = value;

        //обработчики событий
        buttonAns.addEventListener("mouseover", mouseButtonAns);
        buttonAns.addEventListener("mouseout",  mouseButtonAns);
        buttonAns.addEventListener("click",  checkAnswer);
        buttonAns.setAttribute("disabled", "disabled");
        buttonAns.disabled = false;

        //добавление кнопки в массив кнопок
        arrOfAnswers.push(buttonAns);
      }
    }
  }
}

//функция, проверяющая ответ
function checkAnswer(){
  //проверка результата и замораживание кнопки
  this.disabled = true;
  if (this.innerHTML === correctAnswer){
    createIcon(this);
    icon.src = "yes.png";
    this.classList.add("answerTrue");
    score += pointsQuestion;
    maxScore += pointsQuestion;
  }
  else{
    createIcon(this);
    icon.src = "no.png";
    this.classList.add("answerFalse");
    maxScore += pointsQuestion;
  }

  //замораживание остальных кнопок
  for(let elem of arrOfAnswers){
    if(!(elem.classList.contains("answerFalse") || elem.classList.contains("answerTrue"))){
      elem.classList.add("answerOther");
      elem.disabled = true;
    }
  }

  //возвращение активности кнопки next
  button.disabled = false;
  button.classList.remove("nextNotActive");
  button.addEventListener("click", clickCreateNewWindow);
}

//функция обновляет окно под текущий вопрос
function CreateNewWindow(){
  //номер вопроса
  questionNumber++;
  if (questionNumber != numberOfQuestions + 1){
  
  //вывод номера текущего вопроса
  writeQuestionNumber();

  //настройка кнопки
  button.classList.add("nextNotActive");
  button.disabled = true;

  //обновление информации
  let Obj = arrOfQuestions[questionNumber - 1];
  for (let key in Obj){
    if (key === "img"){
      img.src =  Obj[key];    
    }

    if (key === "question"){
      textOfQuestion.innerHTML = Obj[key];
    }

    if (key === "score"){
      pointsQuestion = Number(Obj[key]);
    }

    if (key === "answers"){
      let arrOfValue = Obj[key];
      correctAnswer = arrOfValue[0];
      shuffle(arrOfValue);

      let i = 0;
      for(let elem of arrOfAnswers){
        elem.disabled = false;
        if(elem.classList.contains("answerFalse")){
          elem.classList.remove("answerFalse");
          elem.classList.remove("answerMouseover");
        }
        else if(elem.classList.contains("answerTrue")){
          elem.classList.remove("answerTrue");
          elem.classList.remove("answerMouseover");
        }
        else if(elem.classList.contains("answerOther")){
          elem.classList.remove("answerOther");
        }

        elem.innerHTML = arrOfValue[i];
        i++;
      }
    }
  }
}
else{
  ShowResult();
  }
}

//функция показывает результат
function ShowResult(){
  //определение результата и чтение из result.json
  let arrResult = JSON.parse(result);
  let startValue;
  let finalValue;
  let obj;
  for(let elem of arrResult){
    for(let key in elem){
        if(key === "startvalue"){
          startValue = Number(elem[key]);
        }

        if(key === "finalvalue"){
          finalValue = Number(elem[key]);
        }
    }

    if (score >= startValue && score <= finalValue){
      obj = elem;
      break;
    }
  }

  //удаление элементов
  parent.removeChild(question);
  parent.removeChild(answers);
  
  //создание элементов
  title = document.createElement("p");
  shortDes = document.createElement("p");
  title.classList.add("title");
  shortDes.classList.add("shortDes");
  parent.appendChild(title);
  parent.appendChild(shortDes);

  //показ информации
  useInformationFromJSON(obj);
  textScore.innerHTML = score + " из " + maxScore;

  //настройка кнопки
  button.innerHTML = "Ещё раз";
  button.classList.remove("nextBottom");
  button.addEventListener("click", clickStart);
}