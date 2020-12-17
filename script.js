let app = document.getElementById('container');

async function getData(url) {
    try {
        let data = await fetch('http://127.0.0.1:3000/' + url);
        return await data.json();
    } catch (e) {
        console.log(e)
    }
}

function loading() {
    app.innerHTML = '<img src="loading.gif" id="loading" alt="Загрузка..."/>';
}

function clear() {
    app.innerHTML = "";
}

class Requests {
    static async send (url) {
        try {
            let data = await fetch('http://127.0.0.1:3000/' + url, {
                credentials: 'include'
            });
            return await data.json();
        } catch (e) {
            console.log(e)
        }
    }
}

class Draw{
    table(data) {
        let table = document.createElement('table');
        this.fillHeader(data, table);
        this.fillContent(data, table);
        app.append(table)
    }

    fillHeader(data, table) {
        let tHead = document.createElement('thead');
        let _row = document.createElement('tr');
        Object.keys(data[0]).forEach(key => {
            let colElement = document.createElement('td');
            colElement.innerText = key;
            colElement.setAttribute('align', 'center');
            _row.append(colElement)
        });
        tHead.append(_row);
        table.append(tHead)
    }

    fillContent (data, table){
        let tBody = document.createElement('tbody');
        data.forEach(row => {
            let _row = document.createElement('tr');
            _row.classList.add('__focus-row', 'row');
            _row.setAttribute('id', row["Шифр совета"]);
            _row.addEventListener('click', () => {this.getOne(row["Шифр совета"])});
            Object.values(row).forEach(columnText => {
                let colElement = document.createElement('td');
                colElement.innerText = columnText;
                colElement.classList.add('cell');
                _row.append(colElement)
            });
            tBody.append(_row);
        });
        table.append(tBody)
    }

    separately(data) {
        Object.keys(data[0]).forEach(key => {
            let definition = document.createElement('h2');
            definition.innerText = key;
            let details = document.createElement('p');
            details.innerText = data[0][key];
            app.append(definition, details)
        })
    }

}

class Council extends Draw {
    constructor() {
        super();
    }

    async getAll() {
        clear();
        loading();
        let data = await Requests.send('councils/');
        await Format.Date(data);
        clear();
        super.table(data);
    }
    async getOne(council_id) {
        clear();
        loading();
        let data = await getData('councils/' + council_id);
        await Format.Date(data);
        clear();
        super.separately(data)
    }
}



class Format {
    static Date(data) {
        if (Object.keys(data[0]).includes('Дата создания')) {
            this.setCorrectDateValues(data, "Дата создания")
        }
        if (Object.keys(data[0]).includes('Дата окончания полномочий')) {
            this.setCorrectDateValues(data, "Дата окончания полномочий")
        }
    }

    static setCorrectDateValues(data, field) {
        Object.entries(data).forEach(dateItem => {
            let date = new Date(dateItem[1][field]);
            dateItem[1][field] = this.getCorrectStingDate(date);
        })
    }

    static getCorrectStingDate(date) {
        let _date = "";
        let day = date.getUTCDate();
        let month = date.getUTCMonth() + 1;
        _date += (day < 10 ? '0' + day : day) + '.';
        _date += (month < 10 ? '0' + month : month) + '.' + date.getUTCFullYear();
        return _date
    }
}

council = new Council();

async function login() {
    let data = await fetch('127.0.0.1:3000/login', {
        method: "POST",
        credentials: "include",
        headers: {
            //'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
            username: 'polesmith',
            password: '101'
        }
    });
    console.log(data);
}