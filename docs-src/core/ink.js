import * as Overlay from '../../core/overlay/index';
import * as Ripple from '../../core/ripple/index';
import { iterateArrayLike } from '../../core/dom';

iterateArrayLike(document.getElementsByClassName('mdw-overlay'), Overlay.attach);
iterateArrayLike(document.getElementsByClassName('mdw-ripple'), Ripple.attach);
