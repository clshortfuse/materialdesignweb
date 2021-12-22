import { iterateArrayLike } from '../../core/dom.js';
import * as Overlay from '../../core/overlay/index.js';

iterateArrayLike(document.querySelectorAll('.js .mdw-overlay'), Overlay.attach);
