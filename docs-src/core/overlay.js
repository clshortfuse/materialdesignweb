import * as Overlay from '../../core/overlay/index';
import { iterateArrayLike } from '../../core/dom';

iterateArrayLike(document.querySelectorAll('.js .mdw-overlay'), Overlay.attach);
