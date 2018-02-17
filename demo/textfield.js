import { Template, TemplateToolbar } from './data/Template';

/** @type {Template[]} */
const templates = [];
templates.push(new Template({
  id: 'components_textfields_labels1',
  img: 'https://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0Bzhp5Z4wHba3UHZpZjVsYjRHcXc/components_textfields_labels1.png',
  statusBarColor: '#303F9F',
  toolbar: new TemplateToolbar({
    color: '#3F51B5',
    title: 'Application',
    start: 'arrow_back',
    end: 'more_vert',
  }),
}));

templates.push(new Template({
  id: 'required-example',
  img: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B5ZSepuCX1xOV21vLWJFeUFoUXc/required-example.png',
  statusBarColor: '#F06292',
  toolbar: new TemplateToolbar({
    color: '#FF80AB',
    title: 'Inbox',
    start: 'menu',
    end: 'search',
  }),
}));
templates.push(new Template({
  id: 'multi1',
  img: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B5ZSepuCX1xOTjBUMXJUU3c4ZUU/multi1.png',
  statusBarColor: '#00796B',
  toolbar: new TemplateToolbar({
    color: '#009688',
    start: 'arrow_back',
    end: 'done',
  }),
}));
templates.push(new Template({
  id: 'area1',
  img: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B5ZSepuCX1xOeEhlTVhUYm53Z1U/area1.png',
  statusBarColor: '#00796B',
  toolbar: new TemplateToolbar({
    color: '#009688',
    start: 'arrow_back',
    end: 'done',
  }),
}));

templates.push(new Template({
  id: 'area2',
  img: 'https://storage.googleapis.com/material-design/publish/material_v_12/assets/0B5ZSepuCX1xOS3ZTZld4c3JhUTQ/area2.png',
  statusBarColor: '#00796B',
  toolbar: new TemplateToolbar({
    color: '#009688',
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
