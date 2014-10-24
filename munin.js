				require('sugar');
var q     =     require('q');
var exec  =     require('child_process').exec;
var Munin =     require('munin-client');

Munin.prototype.log = function(name,option){
	option = Object.merge({
		dir: '/var/lib/munin/com',
		start: 'now-1day',
		end: 'now',
		type: 'MAX'
	},option);

	var munin = this;
	var node = this.host;

	var d = q.defer();
	munin.config(name,function(config){
		var task = [];
		var keys = Object.keys(config)
			.filter(function(key){
				return ! key.startsWith('graph_')
			});
		keys.each(function(key){
			var d = q.defer();
			task.push(d.promise);
			exec('rrdtool fetch {dir}/{node}-{name}-{key}-?.rrd  {type} -s {start} -e {end}'
			.assign({
				key:key,
				node:node,
				name:name
			},option),function(err,stdout,stderr){
				stderr? d.reject(stderr) : d.resolve(stdout);
			})
		});
		q.allSettled(task).then(function(results){
			var result = {};
			keys.each(function(key,index){
				result[key] = results[index].value
					.split('\n')
					.from(2)
					.filter(function(line){
						return !!line
					})
					.map(function(line){
						return line.split(': ').map(function(string){return +string } );
					})
					.filter(function(data){
						return !isNaN(data[1]);
					})
			});
			d.resolve(result);
		});
	});
	return d.promise;
}

module.exports = Munin;
