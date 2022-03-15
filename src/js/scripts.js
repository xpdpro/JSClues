$(function () {
    let airDate = document.getElementById("airDate").value;


    getClues(0, airDate, "#cluesList");
    getRandomClue();
    getCategories();
    populateAirdates();

    $('#clues-tab a').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
    $('#category-tab a').on('click', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
    $("#accordion").accordion();
});

function getRandomClue() {
    fetch('http://jservice.io/api/random')
        .then((res) => {
            return res.json();
        })
        .then((loadedQuestion) => {
            if (loadedQuestion[0].question) {
                question.innerHTML = loadedQuestion[0].question;
                answer.innerHTML = loadedQuestion[0].answer;
            }            
        })
        .catch((err) => {
            console.error(err);
        });
}

function getClues(catId = 0, airDate = null, divContainer) {
    let apiUrl; 
    if (catId > 0) {
        apiUrl = 'http://jservice.io/api/clues?category=' + catId;
    } else if (airDate) {
        apiUrl = 'http://jservice.io/api/clues?min_date=' + airDate;
    } else{
        apiUrl = 'http://jservice.io/api/clues';
    }

    fetch(apiUrl)
        .then((res) => {
            return res.json();
        })
        .then((items) => {
            renderClues(items, divContainer);
        })
        .catch((err) => {
            console.error(err);
        });
}

function populateAirdates() {
    fetch('http://jservice.io/api/clues')
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            let lookup = {};
            let result = [];

            for (let item, i = 0; item = data[i++];) {
                let airDate = item.airdate;

                if (!(airDate in lookup)) {
                    lookup[airDate] = 1;
                    result.push(airDate);
                }
            }
            $('#airDate').empty();
            $.each(result, function (i, p) {
                $('#airDate').append($('<option></option>').val(p).html(p.substring(0, 10)));
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

function getCategories(catId = 0) {
    let apiUrl;

    if (catId > 0) {
        apiUrl = 'http://jservice.io/api/categoriy?id=' + catId;
    } else {
        apiUrl = 'http://jservice.io/api/categories?count=100';
    }

    fetch(apiUrl)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            renderDataInTable(data);
            $('#dpCategory').empty();
            $.each(data, function (i, p) {
                $('#dpCategory').append($('<option></option>').val(p.id).text(p.title));
            });
        })
        .catch((err) => {
            console.error(err);
        });
}

function renderDataInTable(data) {
    let id = '';
    let html = '';
    data.forEach(item => {
        id = item.title.replace(/[^a-zA-Z]/g, '').toLowerCase();
        html += '<div class="accordion-item">';
        html += '<h4 class="accordion-header" id="h-' + id + '">';
        html += '<button class="accordion-button" type = "button" data-bs-toggle="collapse" data-bs-target="#' + id + '" aria-expanded="false">'+item.title+'</button></h4>'
        html += '<div id="'+id+'" class="accordion-collapse collapse show" data-bs-parent="#categoryList">'
        html += '<div class="accordion-body">';
        html += '<strong>This Category contains ' + item.clues_count + ' clues.</strong>';
        html += '</div></div></div></div>';
    });
    $('#categoryList').html(html);
    $('#categoryList .collapse').collapse('hide');
}

function renderClues(data, divContainer) {
    let html = ''; 
    $(divContainer).empty();
    data.forEach(item => {
        html += '<div class="accordion-item">';
        html += '<h4 class="accordion-header" id="h-' + item.id + '">';
        html += '<button class="accordion-button" type = "button" data-bs-toggle="collapse" data-bs-target="#r' + item.id + '" aria-expanded="false">'+item.question + '</button></h4>'
        html += '<div id="r' + item.id + '" class="accordion-collapse collapse show" data-bs-parent="#catCluesList">'
        html += '<div class="accordion-body">';
        html += item.answer;
        html += '</div></div></div></div>';
    });
    $(divContainer).html(html);
    $(divContainer + ' .collapse').collapse('hide');
}

function dateChange(control) {
    getClues(0, control.value, '#clueList');
}

function catChange(control) {
    getClues(control.value, null, '#catClueList');
}
