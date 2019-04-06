import * as Ripple from '../../core/ripple/index';
import { iterateArrayLike } from '../../core/dom';

iterateArrayLike(document.querySelectorAll('.js .mdw-ripple'), Ripple.attach);
