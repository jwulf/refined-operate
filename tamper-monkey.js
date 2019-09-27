// ==UserScript==
// @name         Refined Operate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Various UI hacks to Operate in Camunda Cloud for my personal preferences
// @author       josh.wulf@camunda.com
// @match        https://*.operate.camunda.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Ghetto fetch to ensure data is client-side
     const url = document.location.origin
    fetch(url +'/api/workflows/grouped').then(() => {

        // Change Cancel button to red text CANCEL
        const items = document.querySelectorAll('button[type="CANCEL_WORKFLOW_INSTANCE"]')
        const ready = !!(items && items.length)
        console.log('Cancel button ready: ' + ready)
        const delay = ready ? 0 : 1000
        setTimeout(() => {
            const itemz = document.querySelectorAll('button[type="CANCEL_WORKFLOW_INSTANCE"]')
            console.log('Found: ' + itemz.length + ' cancel buttons')
            for (let i of itemz) {
                i.style.color='red'
                i.innerHTML="CANCEL"
            }
        }, delay);

        // Add process id to Workflows drop-down
        const workflow = document.getElementsByName('workflow')
        if (workflow) {
            const ready = !!workflow[0]
            console.log('Workflows ready: ' + ready)
            const delay = ready ? 0 : 1000 // It can take time for the Workflows to update
            setTimeout(() => {
                const itemz = workflow[0].children
                for (let i of itemz) {
                    if (i.innerHTML === 'Workflow') {
                        i.innerHTML = 'Workflow Name - [ Process ID ]';
                    } else {
                        i.innerHTML += ' - [ ' + i.value + ' ]';
                    }
                }
            }, delay)
        }
    })
})();
