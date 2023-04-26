const params = new URLSearchParams(window.location.search)
let noteStorage = [];
document.addEventListener('DOMContentLoaded', function() {
  fetch('http://localhost:5500/notes')
      .then(response => response.json())
      .then(data => {
        noteStorage = data;
        console.log(noteStorage);
      })
      .catch(error => console.log(error));
})
window.addEventListener('load', function () {
  const $$ = this.document.querySelectorAll.bind(this.document);
  const app = {
    getDataFromLS: function () {
      // noteStorage = JSON.parse(noteStorage)
      // console.log(noteStorage);
    },
    renderNoteFromLS: function () {
      const tabContents = [...$$('.tab-content')]
      tabContents.forEach(item => {
        let child = item.lastElementChild

        while (child) {
          item.removeChild(child)

          child = item.lastElementChild
        }
      })

      noteStorage.sort((a, b) => b.lastUpdate - a.lastUpdate)
      noteStorage.forEach(item => {
        
        const d = new Date(item.lastUpdate)
        const date = `${d.toLocaleDateString('vi-VI')} ${d.toLocaleTimeString(
          'vi-VI'
        )}`

        const isBookmark = item.bookmark ? 'is-active' : ''
        const noteHtml = `<div class="note-wrapper" data-id="${item.id}">
                <div class="note-wrapper__left">
                  <div class="note-header">
                    <div class="note-header__left">
                      <i class="fas fa-circle"></i>
                      <h5>${item.title}</h5>
                    </div>
                    <div
                      class="note-header__right icon-list"
                      data-id="${item.id}"
                    >
                      
                      <a class="link-item edit">
                        <i class="fas fa-edit icon-item edit"></i>
                      </a>
                      <a class="link-item download">
                        <i
                          class="fas fa-arrow-alt-circle-down icon-item download"
                        >
                        </i>
                      </a>
    
                      <a class="link-item remove">
                        <i class="fas fa-times-circle icon-item remove"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="note-wrapper__right">
                  <div class="note-date">
                    <div class="note-date__header">
                      <h5>Last update</h5>
                    </div>
                    <div class="note-date__content">
                      <p>${date}</p>
                    </div>
                  </div>
                </div>
              </div>`

        tabContents.forEach(node => {
          if (node.getAttribute('data-tab') === '1') {
            node.insertAdjacentHTML('beforeend', noteHtml)
          }
          if (node.getAttribute('data-tab') === '2' && item.bookmark) {
            node.insertAdjacentHTML('beforeend', noteHtml)
          }
        })
      })
    },
    switchTabNote: function (renderNoteFromLS) {
      const tabHeaders = [...$$('.tab-item')]
      const tabContents = [...$$('.tab-content')]

      tabHeaders.forEach(item => {
        item.addEventListener('click', e => {
          renderNoteFromLS()
          e.target.classList.add('is-active')

          const numTab = e.target.dataset.tab
          tabContents.forEach(i => {
            if (i.dataset.tab === numTab) {
              i.classList.add('is-active')
            } else {
              i.classList.remove('is-active')
            }
          })

          tabHeaders.forEach(i => {
            if (i !== e.target) {
              i.classList.remove('is-active')
            }
          })
        })
      })
    },
    openTextEditor: (isEdit, noteId, a_node) => {
      if (isEdit) {
        a_node.setAttribute('href', `editor.html?edit=true&id=${noteId}`)
      } else {
        a_node.setAttribute('href', `editor.html?edit=false`)
      }
    },
    featureHandle: (openTextEditor, downloadNote, viewNote) => {
      document.addEventListener('click', e => {
        if (e.target.matches('.new-note')) {
          openTextEditor(false, null, e.target)
        }
        if (e.target.matches('.link-item.edit')) {
          const noteId = e.target.parentNode.getAttribute('data-id')
          openTextEditor(true, noteId, e.target)
        }
        if (e.target.matches('.link-item.bookmark')) {
          const noteId = e.target.parentNode.getAttribute('data-id')
          const note = noteStorage.find(item => item.id === noteId)

          note.bookmark = !note.bookmark
          e.target.firstElementChild.classList.toggle('is-active')
          sessionStorage.setItem('notes', JSON.stringify(noteStorage))
        }
        if (e.target.matches('.link-item.download')) {
          const noteId = e.target.parentNode.getAttribute('data-id')
          downloadNote(noteId)
        }
        if (e.target.matches('.link-item.view')) {
          const noteId = e.target.parentNode.getAttribute('data-id')
          viewNote(noteId)
        }
        if (e.target.matches('.cancel-wrapper')) {
          document.body.removeChild(e.target.parentNode.parentNode)
        }
        if (e.target.matches('.cancel-btn')) {
          document.body.removeChild(e.target.parentNode.parentNode.parentNode)
        }
        if (
          e.target.matches('.view-overlay') ||
          e.target.matches('.alert-overlay')
        ) {
          document.body.removeChild(e.target)
        }
        if (e.target.matches('.link-item.remove')) {
          const noteId = e.target.parentNode.getAttribute('data-id')
          let note = [];
          noteStorage.forEach(item => {
            if (item.id === noteId){
              note = item;
            }
          })
          const lastUpdate = Date.now();

          const alertRemoveHtml = `<div class="alert-overlay">
            <div class="alert-wrapper">
              <div class="warning-box">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="content-wrapper">
                <div class="content-wrapper">${note.title}</div>
                <div class="last-update-wrapper">${lastUpdate}</div>
              </div>
              <div class="button-box">
                <button class="btn-item delete-btn" data-id="${noteId}">Delete</button>
                <button class="btn-item cancel-btn">Cancel</button>
              </div>
            </div>
          </div>`

          document.body.insertAdjacentHTML('beforeend', alertRemoveHtml);
        }
        if (e.target.matches('.btn-item.delete-btn')) {
          const noteId = e.target.getAttribute('data-id')
          this.fetch('http://localhost:5500/delete', {
            headers: {
              'Content-type': 'application/json' 
            },
            method: 'POST',
            body: JSON.stringify({id: noteId})
          })
          .then(res => res.json())
          .then(data => console.log(data));
        }
      })
    },
    downloadNote: noteId => {
      const note = noteStorage.find(item => item.id === noteId)
      if (!note) {
        throw new Error('file not found')
      }
      var element = document.createElement('a')
      element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8, ' + encodeURIComponent(note.content)
      )
      const filename =
        note.lastUpdate + '-' + note.title.split(' ').join('-') + '.html'
      element.setAttribute('download', filename)
      document.body.appendChild(element)
      element.click()
    },
    viewNote: noteId => {
      const note = noteStorage.find(item => item.id === noteId)
      const lastUpdate = new Date(note.lastUpdate).toLocaleString('vi-VI')
      const viewNodeHtml = `<div class="view-overlay">
        <div class="view-wrapper">
          <div class="cancel-wrapper">
            <i class="fas fa-times cancel"></i>
          </div>
          <div class="title-wrapper">
            <h3>${note.title}</h3>
          </div>
          <div class="content-wrapper">${note.content}</div>
          <div class="last-update-wrapper">${lastUpdate}</div>
        </div>
      </div>`

      document.body.insertAdjacentHTML('beforeend', viewNodeHtml)
    },
    run: function () {
      const _this = this;
      
      _this.getDataFromLS()
      // const data = JSON.parse(noteStorage);
      // const tmp = noteStorage.find(item => item.id === 11);
      // console.log(tmp);
      _this.switchTabNote(_this.renderNoteFromLS)
      _this.renderNoteFromLS()
      _this.featureHandle(
        _this.openTextEditor,
        _this.downloadNote,
        _this.viewNote,
        _this.renderNoteFromLS
      )
    },
  }
  app.run();
})