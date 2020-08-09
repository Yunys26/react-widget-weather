import React from 'react';
import { action, extendObservable, computed} from "mobx";
import axios from 'axios';
import ButtonSend from '../components/MainSection/ButtonSend/ButtonSend';
import Modal from '../components/MainSection/Modal/Modal';
// import { element } from 'prop-types';
class Store {
    // Наблюдаемые данные
    constructor () {
        extendObservable(this, {
            inputValue: '',
            result: null,
            nameCountry: null,
            temp: null,
            data: [],
        })
    }
    // Отображение таб "Активные"
    @action returnActive = (e) => {
        // В активных отображается все города котоыре не были удалены в копии массива, если удаляет возвращается на то же место либо доавляется в конец 
        console.log("Восстановлен");
        document.querySelector('.modalUseDelete').style.display = 'block';
        document.querySelector('.modalUseReturn').style.display = 'none';
    };
    // Отображение таб "Удаленные"
    @action deleteCity = (e) => {
        // удляет по клику делает копию массива и удаляет данные элемент по назваани города из массив в котором объекты
        console.log("Удален");
        document.querySelector('.modalUseDelete').style.display = 'none';
        document.querySelector('.modalUseReturn').style.display = 'block';
        document.querySelector('.modal').style.display = 'none';
    };
    // Отображение в таб "все"
    @computed get addTabsCityAll () {
        return this.data.map( (elementArray) => <p>{elementArray.name}</p>);
    }
    // Рендерит строку таблицы 
    @computed get addDataTable () {
        // Проверять на повтор (если вводитсья второй раз москва, то выводиться город уже ввелся)
        return this.data.map( (elementArray) => 
            <tr>
                <th>{elementArray.name}</th>
                <th className="anim">{Math.round(elementArray.temp) - 273}&#176;</th>
                <th>
                    <ButtonSend 
                        className="upButton" 
                        valueButton="Вверх" 
                        clickButton={this.up}
                    />
                </th>
                <th>
                    <ButtonSend 
                        className="downButton" 
                        valueButton="Вниз" 
                        clickButton={this.down}
                    />
                </th>
                <th>
                    <ButtonSend
                        className="modalUseDelete" 
                        valueButton="Удалить" 
                        clickButton={this.modalOpen}
                    />
                    <ButtonSend 
                        className="modalUseReturn" 
                        valueButton="Восстановить" 
                        clickButton={this.returnActive}
                    />
                </th>
                <Modal nameCity={elementArray.name}/>
            </tr>
        );
    };
    // Закрывает модальное окно 
    @action modalClose = (e) => {
        if (e.target === document.querySelector('.modal') || e.target === document.querySelector('.modalClose')) document.querySelector('.modal').style.display = 'none';
    }; 
    // Открывает моадльное окно
    @action modalOpen = (e) => {
        e.preventDefault();
        if (e.target === document.querySelector('.modalUseDelete')) document.querySelector('.modal').style.display = 'block';
    };
    // Перемещение по таблице вверх
    @action up = (e) => {
        if (this.data.length === 1) {
            return console.log('1');
        } else if (this.data.length > 1) {
            for (let i = 0; i < this.data.length - 1; i++) {
                return ( i !== 0) ? alert("Выше некуда") : this.data.unshift(this.data.pop());
            }
            // return this.data.unshift(this.data.pop());
        }
        console.log(this.data.length)
    }
    // Перемещение по таблице вниз
    @action down = (e) => {
        if (this.data.length === 1) {
            return console.log('1');
        } else if (this.data.length > 1) {
            // Возвращает длину массива 
            for (let i = 0; i < this.data.length - 1; i++) {
                return ( i !== this.data.length - 1) ? alert("Выше некуда") : this.data.unshift(this.data.pop());
            }
            // return (this.data[this.data.length - 1]) ? alert("Ниже некуда") : this.data.unshift(this.data.pop());
            // return console.log(this.data.unshift(this.data.pop()));
        }
        console.log(this.data.length)
    };
    // Изменяет состояние инпута 
    @action handleDataInput = (e) => {
        console.log(this.inputValue)
        return this.inputValue = e.target.value;
    };
    //  При нажатии нa enter
    @action handleKeyPress = (e) => {
        e.preventDefault();
        if (e.key === "Enter") return this.formSendCoutry();
    };

    // Осуществляет запрос на api и получает ответ, при клике на кнопку
    @action formSendCoutry = async (e) => {
        e.preventDefault();
        // `https://api.openweathermap.org/data/2.5/weather?q=${this.state.text}&appid=bcd470ab4ddba97b244ed20fafeb41a7`
        /* Через библу axios попроще, потому что просто приходит объект */
        await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.inputValue}&appid=bcd470ab4ddba97b244ed20fafeb41a7`)    
            .then( res => {
                // чтобы создавать каждый раз запрос, можно создвавать ему уникальное имя (без mobx)
                console.log(this.nameCountry, this.temp)
                this.result = res.data;
                // this.nameCountry = res.data.name;
                // this.temp = res.data.main.temp
                this.data.push({name: res.data.name, temp: res.data.main.temp})
                console.log(this.data)
                console.log(res.data);
                // console.log(this.nameCountry, this.temp);
                // return this.tesData = {name: res.data.name, temp: res.data.main.temp};
            })
            .catch( (error) => {
                // handle error
                return console.log("Response errror" + error);
            })
        document.querySelector('.formSendCoutry').reset();
    };

        // очищение поля, надо придумать что то оригинальней
        // document.getElementById('FormSendCoutry').reset();
        
        /* Запрос с помощью fetch, но лучше его не использовать в связке react + redux  
            сначала с помощью отправлял данные, в итоге понял что такое promise разобрался в нем 
            и теперь понимаю как принимать данные если они находятся в Promise
        */
        // await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${this.state.text}&appid=bcd470ab4ddba97b244ed20fafeb41a7`,)
        //     .then( response => response.json() )
        //     .then( result => {

        //         this.setState( state => {
        //             return {result: state.result = result.main};
        //         })
        //     })
        //     .catch( error => {
        //         console.log('Request failed', error);
        //     })

    // написать обработку для неправильного ответа от сервера 
}

export default new Store();
