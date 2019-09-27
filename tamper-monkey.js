// ==UserScript==
// @name         Refined Operate
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Various UI hacks to Operate in Camunda Cloud for my personal preferences
// @author       You
// @match        https://*.operate.camunda.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const hadEffect = true
    let globalDelay = 500
    const modTimers = {}
    const log = console.log

    log('Reloaded State')
    const modifications = [
        {
            name: 'Change Cancel button to red text CANCEL',
            idempotent: true,
            handler: () => {
                const itemz = document.querySelectorAll('button[type="CANCEL_WORKFLOW_INSTANCE"]')
                // log('Found: ' + itemz.length + ' cancel buttons')
                for (let i of itemz) {
                    i.style.color='red'
                    i.innerHTML="CANCEL"
                }
                return hadEffect
            }
        },

        {
            name: 'Add process id to Workflows drop-down',
            idempotent: false,
            handler: () => {
                const workflow = document.getElementsByName('workflow')
                const itemz = workflow[0].children
                for (let i of itemz) {
                    if (i.innerHTML === 'Workflow') {
                        i.innerHTML = 'Workflow Name - [ Process ID ]';
                    } else {
                        i.innerHTML += ' - [ ' + i.value + ' ]';
                    }
                }
                // log('Workflow mod had effect')
                return hadEffect
            }
        }
    ]


    // Implements a simple exponential back-off
    function modify(mod, delay) {
        // log({delay, globalDelay})
        // log({name: mod.name, hasRun: mod.hasRun, idempotent: mod.idempotent})
        delay = globalDelay || delay || 500
        if (!mod.idempotent && mod.hasRun) {
            return
        }
        modTimers[mod.name] = setTimeout(() => {
            try {
                if (mod.hasRun && !mod.idempotent) {
                    return
                }
                const itWorked = mod.handler()
                if (!itWorked || (itWorked && mod.idempotent)) {
                    modTimers[mod.name] = modify(mod, delay * 2) // doAgain with increased delay
                } else {
                    delete modTimers[mod.name]
                    mod.hasRun = true
                }
            } catch (e) {
                 modTimers[mod.name] = modify(mod, delay * 2)
            }
        }, delay)
    }

    window.addEventListener('popstate', () => {
        log('popstate');
        listener()
    });



    listener()

    function listener() {
        Object.keys(modTimers).forEach(m => {
            clearTimeout(modTimers[m])
        })
        for (let mod of modifications) {
            mod.hasRun = false
        }
        globalDelay = 500
        modifications.forEach(modify)
        globalDelay = 0
    }


})();

