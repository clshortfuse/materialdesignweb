import { Template, TemplateToolbar } from './data/Template';

/** @type {Template[]} */
const templates = [];
templates.push(new Template({
  id: 'components_textfields_labels1',
  img: 'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3UHZpZjVsYjRHcXc/components_textfields_labels1.png',
  statusBarColor: 'rgb(var(--primary-700-color))',
  toolbar: new TemplateToolbar({
    color: 'rgb(var(--primary-500-color))',
    title: 'Application',
    start: 'arrow_back',
    end: 'more_vert',
  }),
}));

templates.push(new Template({
  id: 'required-example',
  img: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B5ZSepuCX1xOV21vLWJFeUFoUXc/required-example.png',
  statusBarColor: 'rgb(var(--accent-300-color))',
  toolbar: new TemplateToolbar({
    color: 'rgb(var(--accent-A100-color))',
    title: 'Inbox',
    start: 'menu',
    end: 'search',
  }),
}));
templates.push(new Template({
  id: 'multi1',
  img: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B5ZSepuCX1xOTjBUMXJUU3c4ZUU/multi1.png',
  statusBarColor: 'rgb(var(--primary-A700-color))',
  toolbar: new TemplateToolbar({
    color: 'rgb(var(--primary-A200-color))',
    start: 'arrow_back',
    end: 'done',
  }),
}));
templates.push(new Template({
  id: 'area1',
  img: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B5ZSepuCX1xOeEhlTVhUYm53Z1U/area1.png',
  statusBarColor: 'rgb(var(--accent-A700-color))',
  toolbar: new TemplateToolbar({
    color: 'rgb(var(--accent-A400-color))',
    start: 'arrow_back',
    end: 'done',
  }),
}));

templates.push(new Template({
  id: 'area2',
  img: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B5ZSepuCX1xOS3ZTZld4c3JhUTQ/area2.png',
  statusBarColor: 'rgb(var(--accent-A700-color))',
  toolbar: new TemplateToolbar({
    color: 'rgb(var(--accent-A400-color))',
    start: 'arrow_back',
    end: 'done',
  }),
}));
templates.push(new Template({
  id: 'components_textfields_counter1',
  img: 'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3WUlMaC1qemQ4WDA/components_textfields_counter1.png',
}));
templates.push(new Template({
  id: 'patterns_errors_userinput19',
  img: 'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3dEZTUF9idzBHMWc/patterns_errors_userinput19.png',
}));

export {
  templates,
};
