import Icon from '../components/Icon.js';

/** @type {DOMParser} */
let domParser;

/**
 * @param {string} url
 */
async function fetchSVGInfo(url) {
  const svg = await fetch(url);
  const text = await svg.text();
  domParser ??= new DOMParser();
  // SVG may be malformed, but HTML compliant
  const parsed = domParser.parseFromString(text, 'text/html');
  // Will automatically throw error;
  return {
    path: parsed.querySelector('path[d]').getAttribute('d'),
    viewBox: parsed.querySelector('[viewBox]').getAttribute('viewBox'),
  };
}

/** @return {void} */
export function addIconAliases() {
  const materialSymbolOutlined = [
    ['palette', 'M480 976q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 32.5-156t88-127Q256 239 330 207.5T488 176q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880 538q0 115-70 176.5T640 776h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480 976ZM260 616q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Z'],
    ['rounded_corner', 'M760 936v-80h80v80h-80Zm0-160v-80h80v80h-80ZM120 616v-80h80v80h-80Zm0 160v-80h80v80h-80Zm0-320v-80h80v80h-80Zm0-160v-80h80v80h-80Zm160 0v-80h80v80h-80Zm320 640v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm640-320V416q0-50-35-85t-85-35H440v-80h200q83 0 141.5 58.5T840 416v200h-80Z'],
    ['font_download', 'M256 816h84l44-122h192l44 122h84L522 336h-84L256 816Zm152-192 70-198h4l70 198H408ZM160 976q-33 0-56.5-23.5T80 896V256q0-33 23.5-56.5T160 176h640q33 0 56.5 23.5T880 256v640q0 33-23.5 56.5T800 976H160Z'],
    ['exposure_plus_1', 'M240 776V656H120v-80h120V456h80v120h120v80H320v120h-80Zm390 80V418l-92 66-46-70 164-118h64v560h-90Z'],
    ['call_to_action', 'M240 776h480V656H240v120Zm-80 120q-33 0-56.5-23.5T80 816V336q0-33 23.5-56.5T160 256h640q33 0 56.5 23.5T880 336v480q0 33-23.5 56.5T800 896H160Z'],
    ['crop_landscape', 'M160 896q-33 0-56.5-23.5T80 816V336q0-33 23.5-56.5T160 256h640q33 0 56.5 23.5T880 336v480q0 33-23.5 56.5T800 896H160Z'],
    ['view_comfy', 'M80 536V256h800v280H80Zm320 360V616h480v280H400Zm-320 0V616h240v280H80Z'],
    ['check_box', 'm424 744 282-282-56-56-226 226-114-114-56 56 170 170ZM200 936q-33 0-56.5-23.5T120 856V296q0-33 23.5-56.5T200 216h560q33 0 56.5 23.5T840 296v560q0 33-23.5 56.5T760 936H200Z'],
    ['edit_attributes', 'M280 776q-83 0-141.5-58.5T80 576q0-83 58.5-141.5T280 376h400q83 0 141.5 58.5T880 576q0 83-58.5 141.5T680 776H280Zm42-108 142-142-42-42-100 100-40-40-42 42 82 82Z'],
    ['edit_calendar', 'M200 976q-33 0-56.5-23.5T120 896V336q0-33 23.5-56.5T200 256h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840 336v240h-80v-80H200v400h280v80H200Zm685-200-85-85 29-29q11-11 28-11t28 11l29 29q11 11 11 28t-11 28l-29 29Zm-325 240v-85l212-212 85 85-212 212h-85Z'],
    ['select_all', 'M200 936q-33 0-56.5-23.5T120 856h80v80Zm-80-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160q0-33 23.5-56.5T200 216v80h-80Zm160 480V376h400v400H280Zm0 160v-80h80v80h-80Zm0-640v-80h80v80h-80Zm80 400h240V456H360v240Zm80 240v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80v80h-80Zm0-640v-80h80v80h-80Zm160 640v-80h80q0 33-23.5 56.5T760 936Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80h80v80h-80Zm0-160v-80q33 0 56.5 23.5T840 296h-80Z'],
    ['border_horizontal', 'M120 936v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80ZM120 776v-80h80v80h-80Zm320 0v-80h80v80h-80Zm320 0v-80h80v80h-80ZM120 616v-80h720v80H120Zm0-160v-80h80v80h-80Zm320 0v-80h80v80h-80Zm320 0v-80h80v80h-80ZM120 296v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Zm160 0v-80h80v80h-80Z'],
    ['list', 'M160 776q-17 0-28.5-11.5T120 736q0-17 11.5-28.5T160 696q17 0 28.5 11.5T200 736q0 17-11.5 28.5T160 776Zm0-160q-17 0-28.5-11.5T120 576q0-17 11.5-28.5T160 536q17 0 28.5 11.5T200 576q0 17-11.5 28.5T160 616Zm0-160q-17 0-28.5-11.5T120 416q0-17 11.5-28.5T160 376q17 0 28.5 11.5T200 416q0 17-11.5 28.5T160 456Zm120 320v-80h560v80H280Zm0-160v-80h560v80H280Zm0-160v-80h560v80H280Z'],
    ['checklist', 'M222 856 80 714l56-56 85 85 170-170 56 57-225 226Zm0-320L80 394l56-56 85 85 170-170 56 57-225 226Zm298 240v-80h360v80H520Zm0-320v-80h360v80H520Z'],
    ['picture_in_picture', 'M440 616h320V376H440v240ZM160 896q-33 0-56.5-23.5T80 816V336q0-33 23.5-56.5T160 256h640q33 0 56.5 23.5T880 336v480q0 33-23.5 56.5T800 896H160Z'],
    ['video_label', 'M160 896q-33 0-56.5-23.5T80 816V336q0-33 23.5-56.5T160 256h640q33 0 56.5 23.5T880 336v480q0 33-23.5 56.5T800 896H160Zm0-200h640V336H160v360Z'],
    ['list_alt', 'M320 776q17 0 28.5-11.5T360 736q0-17-11.5-28.5T320 696q-17 0-28.5 11.5T280 736q0 17 11.5 28.5T320 776Zm0-160q17 0 28.5-11.5T360 576q0-17-11.5-28.5T320 536q-17 0-28.5 11.5T280 576q0 17 11.5 28.5T320 616Zm0-160q17 0 28.5-11.5T360 416q0-17-11.5-28.5T320 376q-17 0-28.5 11.5T280 416q0 17 11.5 28.5T320 456Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200 936q-33 0-56.5-23.5T120 856V296q0-33 23.5-56.5T200 216h560q33 0 56.5 23.5T840 296v560q0 33-23.5 56.5T760 936H200Z'],
    ['more_vert', 'M480 896q-33 0-56.5-23.5T400 816q0-33 23.5-56.5T480 736q33 0 56.5 23.5T560 816q0 33-23.5 56.5T480 896Zm0-240q-33 0-56.5-23.5T400 576q0-33 23.5-56.5T480 496q33 0 56.5 23.5T560 576q0 33-23.5 56.5T480 656Zm0-240q-33 0-56.5-23.5T400 336q0-33 23.5-56.5T480 256q33 0 56.5 23.5T560 336q0 33-23.5 56.5T480 416Z'],
    ['rotate_right', 'M522 976v-82q34-5 66.5-18t61.5-34l56 58q-42 32-88 51.5T522 976Zm-80 0q-138-18-229-119.5T122 618q0-75 28.5-140.5t77-114q48.5-48.5 114-77T482 258h6l-62-62 56-58 160 160-160 160-56-56 64-64h-8q-117 0-198.5 81.5T202 618q0 104 68 182.5T442 894v82Zm322-134-58-56q21-29 34-61.5t18-66.5h82q-5 50-24.5 96T764 842Zm76-264h-82q-5-34-18-66.5T706 450l58-56q32 39 51 86t25 98Z'],
    ['radio_button_checked', 'M480 776q83 0 141.5-58.5T680 576q0-83-58.5-141.5T480 376q-83 0-141.5 58.5T280 576q0 83 58.5 141.5T480 776Zm0 200q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Z'],
    ['tune', 'M440 936V696h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160V216h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z'],
    ['toggle_on', 'M280 816q-100 0-170-70T40 576q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm400-120q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z'],
    ['tab', 'M160 896q-33 0-56.5-23.5T80 816V336q0-33 23.5-56.5T160 256h640q33 0 56.5 23.5T880 336v480q0 33-23.5 56.5T800 896H160Zm360-400h280V336H520v160Z'],
    ['edit', 'M772 453 602 285l56-56q23-23 56.5-23t56.5 23l56 56q23 23 24 55.5T829 396l-57 57Zm-58 59L290 936H120V766l424-424 170 170Z'],
    ['edit_note', 'M480 936v-85l212-212 85 85-212 212h-85ZM120 736v-80h280v80H120Zm685-40-85-85 29-29q11-11 28-11t28 11l29 29q11 11 11 28t-11 28l-29 29ZM120 576v-80h440v80H120Zm0-160v-80h440v80H120Z'],
    ['schedule', 'm612 764 56-56-148-148V376h-80v216l172 172ZM480 976q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Z'],
    ['web_asset', 'M160 896q-33 0-56.5-23.5T80 816V336q0-33 23.5-56.5T160 256h640q33 0 56.5 23.5T880 336v480q0 33-23.5 56.5T800 896H160Zm0-80h640V416H160v400Z'],
    ['settings', 'm370 976-16-128q-13-5-24.5-12T307 821l-119 50L78 681l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78 471l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12l-16 128H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342 576q0 58 40.5 99t99.5 41Z'],
    ['check', 'M382 816 154 588l57-57 171 171 367-367 57 57-424 424Z'],
    ['arrow_back', 'M480 896 160 576l320-320 57 56-224 224h487v80H313l224 224-57 56Z'],
    ['search', 'M784 936 532 684q-30 24-69 38t-83 14q-109 0-184.5-75.5T120 476q0-109 75.5-184.5T380 216q109 0 184.5 75.5T640 476q0 44-14 83t-38 69l252 252-56 56ZM380 656q75 0 127.5-52.5T560 476q0-75-52.5-127.5T380 296q-75 0-127.5 52.5T200 476q0 75 52.5 127.5T380 656Z'],
    ['favorite', 'm480 936-58-52q-101-91-167-157T150 608.5Q111 556 95.5 512T80 422q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810 608.5Q771 661 705 727T538 884l-58 52Z'],
    ['star', 'm233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z'],
    ['flight', 'M340 976v-60l80-60V636L80 736v-80l340-200V236q0-25 17.5-42.5T480 176q25 0 42.5 17.5T540 236v220l340 200v80L540 636v220l80 60v60l-140-40-140 40Z'],
    ['luggage', 'M280 936q-33 0-56.5-23.5T200 856V416q0-33 23.5-56.5T280 336h80V216q0-20 18.5-30t41.5-10h120q23 0 41.5 10t18.5 30v120h80q33 0 56.5 23.5T760 416v440q0 33-23.5 56.5T680 936q0 17-11.5 28.5T640 976q-17 0-28.5-11.5T600 936H360q0 17-11.5 28.5T320 976q-17 0-28.5-11.5T280 936Zm140-600h120V236H420v100ZM320 816h60V456h-60v360Zm130 0h60V456h-60v360Zm130 0h60V456h-60v360Z'],
    ['explore', 'm260 796 300-140 140-300-300 140-140 300Zm220-180q-17 0-28.5-11.5T440 576q0-17 11.5-28.5T480 536q17 0 28.5 11.5T520 576q0 17-11.5 28.5T480 616Zm0 360q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Z'],
    ['filter_2', 'M440 696h240v-80H520v-80h80q33 0 56.5-23.5T680 456v-80q0-33-23.5-56.5T600 296H440v80h160v80h-80q-33 0-56.5 23.5T440 536v160ZM320 816q-33 0-56.5-23.5T240 736V256q0-33 23.5-56.5T320 176h480q33 0 56.5 23.5T880 256v480q0 33-23.5 56.5T800 816H320ZM160 976q-33 0-56.5-23.5T80 896V336h80v560h560v80H160Z'],
    ['filter_5', 'M440 696h160q33 0 56.5-23.5T680 616v-80q0-33-23.5-56.5T600 456h-80v-80h160v-80H440v240h160v80H440v80ZM320 816q-33 0-56.5-23.5T240 736V256q0-33 23.5-56.5T320 176h480q33 0 56.5 23.5T880 256v480q0 33-23.5 56.5T800 816H320ZM160 976q-33 0-56.5-23.5T80 896V336h80v560h560v80H160Z'],
    ['1k', 'M480 696h60v-90l70 90h70l-90-120 90-120h-70l-70 90v-90h-60v240Zm-140 0h60V456H280v60h60v180ZM200 936q-33 0-56.5-23.5T120 856V296q0-33 23.5-56.5T200 216h560q33 0 56.5 23.5T840 296v560q0 33-23.5 56.5T760 936H200Z'],
    ['2k', 'M520 696h60v-90l70 90h70l-90-120 90-120h-70l-70 90v-90h-60v240Zm-260 0h180v-60H320v-40h80q17 0 28.5-11.5T440 556v-60q0-17-11.5-28.5T400 456H260v60h120v40h-80q-17 0-28.5 11.5T260 596v100Zm-60 240q-33 0-56.5-23.5T120 856V296q0-33 23.5-56.5T200 216h560q33 0 56.5 23.5T840 296v560q0 33-23.5 56.5T760 936H200Z'],
    ['3k', 'M520 696h60v-90l70 90h70l-90-120 90-120h-70l-70 90v-90h-60v240Zm-260 0h140q17 0 28.5-11.5T440 656V496q0-17-11.5-28.5T400 456H260v60h120v40h-80v40h80v40H260v60Zm-60 240q-33 0-56.5-23.5T120 856V296q0-33 23.5-56.5T200 216h560q33 0 56.5 23.5T840 296v560q0 33-23.5 56.5T760 936H200Z'],
    ['4k', 'M520 696h60v-90l70 90h70l-90-120 90-120h-70l-70 90v-90h-60v240Zm-140 0h60v-60h40v-60h-40V456h-60v120h-60V456h-60v180h120v60ZM200 936q-33 0-56.5-23.5T120 856V296q0-33 23.5-56.5T200 216h560q33 0 56.5 23.5T840 296v560q0 33-23.5 56.5T760 936H200Z'],
    ['refresh', 'M480 896q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720 366V256h80v280H520v-80h168q-32-56-87.5-88T480 336q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z'],
    ['volume_up', 'M560 925v-82q90-26 145-100t55-168q0-94-55-168T560 307v-82q124 28 202 125.5T840 575q0 127-78 224.5T560 925ZM120 696V456h160l200-200v640L280 696H120Zm440 40V414q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560 736Z'],
    ['check_indeterminate_small', 'M280 616v-80h400v80H280Z'],
    ['person', 'M480 576q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160 896V784q0-34 17.5-62.5T224 678q62-31 126-46.5T480 616q66 0 130 15.5T736 678q29 15 46.5 43.5T800 784v112H160Z'],
    ['chevron_right', 'm376 816-56-56 184-184-184-184 56-56 240 240-240 240Z'],
    ['visibility', 'M480 736q75 0 127.5-52.5T660 556q0-75-52.5-127.5T480 376q-75 0-127.5 52.5T300 556q0 75 52.5 127.5T480 736Zm0-72q-45 0-76.5-31.5T372 556q0-45 31.5-76.5T480 448q45 0 76.5 31.5T588 556q0 45-31.5 76.5T480 664Zm0 192q-146 0-266-81.5T40 556q54-137 174-218.5T480 256q146 0 266 81.5T920 556q-54 137-174 218.5T480 856Z'],
    ['content_copy', 'M200 976q-33 0-56.5-23.5T120 896V336h80v560h440v80H200Zm160-160q-33 0-56.5-23.5T280 736V256q0-33 23.5-56.5T360 176h360q33 0 56.5 23.5T800 256v480q0 33-23.5 56.5T720 816H360Z'],
    ['content_paste', 'M200 936q-33 0-56.5-23.5T120 856V296q0-33 23.5-56.5T200 216h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594 216h166q33 0 56.5 23.5T840 296v560q0 33-23.5 56.5T760 936H200Zm0-80h560V296h-80v120H280V296h-80v560Zm280-560q17 0 28.5-11.5T520 256q0-17-11.5-28.5T480 216q-17 0-28.5 11.5T440 256q0 17 11.5 28.5T480 296Z'],
    ['cloud', 'M260 896q-91 0-155.5-63T40 679q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760 536q69 8 114.5 59.5T920 716q0 75-52.5 127.5T740 896H260Z'],
    ['arrow_right', 'M400 776V376l200 200-200 200Z'],
    ['change_history', 'm80 896 400-640 400 640H80Z'],
    ['add', 'M440 856V616H200v-80h240V296h80v240h240v80H520v240h-80Z'],
    ['menu', 'M120 816v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z'],
    ['sunny', 'M440 296V136h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760Zm-320 400V856h80v160h-80ZM254 404 140 293l57-56 113 113-56 54Zm508 512L651 801l54-54 114 110-57 59ZM40 616v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Z'],
    ['close', 'm256 856-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'],
    ['light_mode', 'M480 776q-83 0-141.5-58.5T280 576q0-83 58.5-141.5T480 376q83 0 141.5 58.5T680 576q0 83-58.5 141.5T480 776ZM80 616q-17 0-28.5-11.5T40 576q0-17 11.5-28.5T80 536h80q17 0 28.5 11.5T200 576q0 17-11.5 28.5T160 616H80Zm720 0q-17 0-28.5-11.5T760 576q0-17 11.5-28.5T800 536h80q17 0 28.5 11.5T920 576q0 17-11.5 28.5T880 616h-80ZM480 296q-17 0-28.5-11.5T440 256v-80q0-17 11.5-28.5T480 136q17 0 28.5 11.5T520 176v80q0 17-11.5 28.5T480 296Zm0 720q-17 0-28.5-11.5T440 976v-80q0-17 11.5-28.5T480 856q17 0 28.5 11.5T520 896v80q0 17-11.5 28.5T480 1016ZM226 378l-43-42q-12-11-11.5-28t11.5-29q12-12 29-12t28 12l42 43q11 12 11 28t-11 28q-11 12-27.5 11.5T226 378Zm494 495-42-43q-11-12-11-28.5t11-27.5q11-12 27.5-11.5T734 774l43 42q12 11 11.5 28T777 873q-12 12-29 12t-28-12Zm-42-495q-12-11-11.5-27.5T678 322l42-43q11-12 28-11.5t29 11.5q12 12 12 29t-12 28l-43 42q-12 11-28 11t-28-11ZM183 873q-12-12-12-29t12-28l43-42q12-11 28.5-11t27.5 11q12 11 11.5 27.5T282 830l-42 43q-11 12-28 11.5T183 873Z'],
    ['dark_mode', 'M480 936q-150 0-255-105T120 576q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444 396q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480 936Z'],
    ['email', 'M160 896q-33 0-56.5-23.5T80 816V336q0-33 23.5-56.5T160 256h640q33 0 56.5 23.5T880 336v480q0 33-23.5 56.5T800 896H160Zm320-280 320-200v-80L480 536 160 336v80l320 200Z'],
    ['arrow_drop_down', 'M480 696 280 496h400L480 696Z'],
    ['account_circle', 'M234 780q51-39 114-61.5T480 696q69 0 132 22.5T726 780q35-41 54.5-93T800 576q0-133-93.5-226.5T480 256q-133 0-226.5 93.5T160 576q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340 476q0-59 40.5-99.5T480 336q59 0 99.5 40.5T620 476q0 59-40.5 99.5T480 616Zm0 360q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Z'], ['attach_file', 'M460 976q-92 0-156-64t-64-156V336q0-66 47-113t113-47q66 0 113 47t47 113v380q0 42-29 71t-71 29q-42 0-71-29t-29-71V336h60v380q0 17 11.5 28.5T460 756q17 0 28.5-11.5T500 716V336q0-42-29-71t-71-29q-42 0-71 29t-29 71v420q0 66 47 113t113 47q66 0 113-47t47-113V336h60v420q0 92-64 156t-156 64Z'],
    ['today', 'M360 756q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200 976q-33 0-56.5-23.5T120 896V336q0-33 23.5-56.5T200 256h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840 336v560q0 33-23.5 56.5T760 976H200Zm0-80h560V496H200v400Z'],
  ];

  for (const [name, path] of materialSymbolOutlined) {
    Icon.addSVGAlias(name, path, '0 96 960 960');
  }

  Icon.addSVGAlias('invertocat', 'M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z', '0 0 98 96');
}

/**
 * @param {string[]} [unaliased]
 * @return {Promise<[string, string][]>}
 */
export async function reportUnaliasedMaterialSymbols(unaliased) {
  if (!unaliased?.length) return [];

  return await Promise.all(
    unaliased.map(async (name) => {
      name = name.toLowerCase();
      const url = `https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/${name}/fill1/24px.svg`;
      const { path, viewBox } = await fetchSVGInfo(url);
      return [name, path];
    }),
  );
}