const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const params = new URLSearchParams(window.location.search)

let noteStorage = [];
document.addEventListener('DOMContentLoaded', function() {
  if (params.get('edit') === 'false'){
    return;
  }
  fetch(`http://localhost:5500/notes/${params.get('id')}`)
      .then(response => response.json())
      .then(data => {
        noteStorage = data;
        console.log(noteStorage);
      })
      .catch(error => console.log(error));
})

window.addEventListener('load', function() {
  const title = $('.title');
  const isEdit = params.get('edit');
  console.log(isEdit);

  if (isEdit === 'true') {
    console.log(noteStorage.content);
    title.value = noteStorage.title;
    const textarea = document.querySelector('textarea');

    this.document.getElementsByClassName('text').textContent = noteStorage.content;
    $('button[name="submit"]').textContent = 'Update';
  }

  $('button[name="submit"]').addEventListener('click', () => {
    if (title.value === '') {
      alert('Please enter a title');
      return;
    }
    if (isEdit === 'true') {
      const d = new Date();
      let note = {
        title: title.value,
        content: tinymce.activeEditor.getContent(),
        lastUpdate: d,
      };
      this.fetch('http://localhost:5500/update', {
        headers: {
          'Content-type': 'application/json' 
        },
        method: 'POST',
        body: JSON.stringify({title: note.title, content: note.content})
      })
      .then(res => res.json())
      .then(data => console.log(data));
    } else {
      const d = new Date();
      let note = {
        title: title.value,
        content: tinymce.activeEditor.getContent(),
        lastUpdate: d,
      };
      this.fetch('http://localhost:5500/insert', {
        headers: {
          'Content-type': 'application/json' 
        },
        method: 'POST',
        body: JSON.stringify({title: note.title, content: note.content})
      })
      .then(res => res.json())
      .then(data => console.log(data));
    }
    window.history.back();
  })
});



