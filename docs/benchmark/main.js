import CustomElement from '../../core/CustomElement.js';

/** @param {number} max */
function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

let id = 1;

CustomElement
  .extend()
  .observe({
    data: { type: 'object', reflect: false },
    selected: { type: 'integer', reflect: false },
  })
  .methods({
    buildData(count = 1000) {
      const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
      const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
      const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
      const data = [];
      for (let i = 0; i < count; i++) { data.push({ id: id++, label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}` }); }
      return data;
    },
    updateData(mod = 10) {
      for (let i = 0; i < this.data.length; i += 10) {
        this.data[i].label += ' !!!';
        // this.data[i] = Object.assign({}, this.data[i], {label: this.data[i].label +' !!!'});
      }
    },

    onItemClick({ currentTarget }) {
      this.selected = currentTarget.dataset.id;
      return false;
    },
    onRemoveClick({ currentTarget }) {
      const id = currentTarget.dataset.id;
      this.data = this.data.filter((item) => item.id != id);
      return false;
    },
  })
  .expressions({
    computeClass({ selected }, { item }) {
      if (item && item.id === selected) return 'danger';
      return '';
    },
  })
  .html`
    <link href="/css/currentStyle.css" rel="stylesheet"/>
    <div class=container>
      <div class=jumbotron>
        <div class=row>
          <div class=col-md-6><h1>MDW unkeyed</h1></div>
          <div class=col-md-6>
            <div class=row>
              <div class="col-sm-6 smallpad">
                <button id=run class="btn btn-primary btn-block">Create 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button id=runlots class="btn btn-primary btn-block">Create 10,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button id=add class="btn btn-primary btn-block">Append 1,000 rows</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button id=update class="btn btn-primary btn-block">Update every 10th row</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button id=clear class="btn btn-primary btn-block">Clear</button>
              </div>
              <div class="col-sm-6 smallpad">
                <button id=swaprows class="btn btn-primary btn-block">Swap Rows</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table id=table class="table table-hover table-striped test-data">
        <tbody>
          <tr mdw-for="{item of data}" id={item.id} class={computeClass}>
            <td class="col-md-1">{item.id}</td>
            <td class="col-md-4"><a data-action=select data-id={item.id} >{item.label}</a></td>
            <td class="col-md-1"><a data-action=remove data-id={item.id} ><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
            <td class="col-md-6"></td>
          </tr>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  `
  .childEvents({
    run: {
      click() {
        this.data = this.buildData();
      },
    },
    runlots: {
      click() {
        this.data = this.buildData(10_000);
      },
    },
    add: {
      click() {
        this.data = this.data.concat(this.buildData(1000));
      },
    },
    update: {
      click() {
        for (let i = 0; i < this.data.length; i += 10) {
          this.patch({
            data: {
              [i]: {
                label: `${this.data[i].label} !!!`,
              },
            },
          });
        }
      },
    },
    swaprows: {
      click() {
        if (this.data.length > 998) {
          const tmp = this.data[1];
          this.data[1] = this.data[998];
          this.data[998] = tmp;
          this.render({
            data: {
              1: this.data[1],
              998: this.data[998],
            },
          });
        }
      },
    },
    clear: {
      click() {
        this.data = [];
        this.selected = null;
      },
    },
    table: {
      click({ target }) {
        const { action, id } = target.dataset;
        switch (action) {
          case 'select':
            this.selected = id;
            return false;
          case 'remove':
            this.data = this.data.filter((item) => item.id != id);
            return false;
          default:
        }
      },
    },
  }).register('benchmark-app');
