import { iterateArrayLike } from '../../core/dom.js';
import * as Ripple from '../../core/ripple/index.js';

iterateArrayLike(document.querySelectorAll('.js .mdw-ripple'), Ripple.attach);
