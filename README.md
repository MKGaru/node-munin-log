node-munin-log
==============

Munin DataLog API

Example
---------

    var Munin = require('munin-log');  
    var munin = new Munin('munin-node.example.com');
  
    munin.log('cpu').then(function(stats){  
      console.log(stats);  
    });
    
    option = {
      dir: '/var/lib/munin/com',
      start: 'now-1day',
      end: 'now',
      type: 'MAX'
    }
    
    munin.log('cpu',option).then(function(stats){  
      console.log(stats);
    });
