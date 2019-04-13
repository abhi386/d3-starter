import * as d3 from 'd3';
import $ from 'jquery';
import 'bootstrap';

//import "css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'webpack-icons-installer/bootstrap';
import './css/style.css';
import * as page from './page';


page.addNavbar();

// set margin
var margin = {left:100, right:10, top:10, bottom:100 };
var height = 400 - margin.top - margin.bottom;
var width = 800 - margin.left - margin.right;

//set scale
var x= d3.scaleLog()
        .base(10)
        .range([0,width])
        .domain([300,4235]);
        

var y = d3.scaleLinear()
          .range([height,0])  
          .domain([20,50]) ;       
        
var area = d3.scaleLinear()
          .range([25*Math.PI, 1500*Math.PI])
          .domain([2000, 400000000]);

// End of Scales

//Groups and Margin

var g = d3.select("#chart-area")
    .append("svg")
    .attr("height",height + margin.top + margin.bottom )
    .attr("width",width + margin.left + margin.right )
    .append("g")
    .attr("transform","translate(" + margin.left +","+ margin.top +")");

//Axis and Labels
//y-axis
var leftAxis = d3.axisLeft(y)
                .ticks(7);
                
                g.append("g")
                 .attr("class","y-axis")
                 .call(leftAxis); 
                 
//x-axis
var bottomAxis = d3.axisBottom(x)
                   .tickValues([400, 1000, 2000, 4000])
                   .tickFormat(d3.format(",.0f"));

            g.append("g")
            .attr("class","x-axis")
            .attr("transform","translate(" + 0 + ","+ height + ")")
            .call(bottomAxis);
            


//Data    
 d3.json("data/data.json").then(function(data){
//console.log(data[0]);
	//Clean Data
	const formattedData = data.map(function(year){
        return year["countries"].filter(function(country){
            var dataExists = (country.income && country.life_exp);
            return dataExists
        }).map(function(country){
            country.income = +country.income;
            country.life_exp = +country.life_exp;
            return country;            
        })
        
	});
	//console.log("hello");
   // console.log(data1);
console.log(formattedData[0]);
console.log ("Income")
console.log(  d3.max(formattedData[0],(d)=>{return d.income;}));
console.log(  d3.min(formattedData[0],(d)=>{return d.income;}));
console.log ("Life Exp")
console.log(  d3.max(formattedData[0],(d)=>{return d.life_exp;}));
console.log(  d3.min(formattedData[0],(d)=>{return d.life_exp;}));
console.log ("Population")
console.log(  d3.max(formattedData[0],(d)=>{return d.population;}));
console.log(  d3.min(formattedData[0],(d)=>{return d.population;}));

  var  circles = g.selectAll("circle")
  .data(formattedData[0], function(d){
       return d.country; })                                  
.enter()
.append("circle")
.attr("cx",(d)=> {return x(d.income);})
.attr("cy",(d)=> {return y(d.life_exp);})
.attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI); })
.attr("fill", "steelblue")
.attr("opacity",0.5)
.attr("stroke",'red')
.attr("stroke-width","1px");
});


/*
 var  circles = g.selectAll("circle")
                .data(countryset, function(d){
                     return d.country; })                                  
            .enter()
            .append("circle")
            .attr("cx",(d)=> {return d.income;})
            .attr("cy",(d)=> {return d.life_exp;})
            .attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI); })
            .attr("fill", "red");


//console.log(data);
*/

