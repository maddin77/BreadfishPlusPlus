// ==UserScript==
// @name        Threads
// @namespace   BreadfishPlusPlus
// @include     http://forum.sa-mp.de/*
// @exclude     http://forum.sa-mp.de/acp/*
// @all-frames  false
// @run-at      document-start
// ==/UserScript==
/*global $, BPPUtils*/

BPPUtils.load(function () {
    "use strict";

    //Erweiterungen: Ankündigungen und wichtige Themen
    if (BPPUtils.storage.get('option.threads.extension.sticky', false) && BPPUtils.isTemplate('tplBoard')) {
        $('#topThreadsStatus').siblings('.titleBarPanel').first().find('.containerHead .containerContent h3').text('Ankündigungen');
        var announcementCount = $('#topThreadsStatus .columnIcon > img[src*="Announcement"]').length;
        $(BPPUtils.template('importantThreadsHeader')).insertAfter($('#topThreadsStatus tbody tr').eq(announcementCount - 1));
    }

    //Filter: Gelöschte Themen
    if (BPPUtils.storage.get('option.threads.filter.deleted', false) && BPPUtils.isTemplate('tplBoard')) {
        $('#normalThreadsStatus tbody > tr .columnIcon > img[src*="Trash"]').closest('tr').remove();

        setTimeout(function () {
            $('#normalThreadsStatus tbody > tr').each(function (index) {
                $(this).attr('class', (index % 2 === 0) ? 'container-1' : 'container-2');
            });
        }, 1000);
    }

});