//κανω fetch το dataset μου και του λεω να κανει τα πάντα με το φόρτωμα της σελίδας--
const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true );
req.send();
req.onload = function(){
      
      const json = JSON.parse(req.responseText);
      const dataset = json;
      console.log(dataset);
      const label = "Date";
//--

      //ορίζω τον κανβά μου--
      const w = 650;
      const h = 500;
      const padding = 60;
      //--

      //οριζω το μιν και το μαξ τoυ xvalue και του yvalue--
      let ndate = new Date();
      let mindate = d3.min(dataset, d=>d.Year-1);
      let maxdate = d3.max(dataset, d=>d.Year+1);
      let minyear = ndate.setFullYear(mindate);
      let maxyear = ndate.setFullYear(maxdate);
      




      let mintime = d3.min(dataset, d => d.Time);
      let maxtime = d3.max(dataset, d => d.Time);
      let mint = mintime.split(':');
      let maxt = maxtime.split(':')
      let dmintime = new Date(1970, 0, 1, 0, mint[0], mint[1]);
      let dmaxtime = new Date(1970, 0, 1, 0, maxt[0], maxt[1]);
            
      
      //--
      

      //οριζω τα scales για τους δυο άξονες--  
      const xScale = d3.scaleTime()
                        .domain([minyear, maxyear])
                        .range([padding, w - padding]);

      const yScale = d3.scaleTime()
                  .domain([dmintime, dmaxtime])
                  .range([padding, h-padding]);
      //--

      //ορίζω τους δύο άξονες του διαγράμματος--
      
      let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
      let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
      
      //--

      //funtions που θα μου χρειαστουν για να μην επαναλαμβάνομαι στα scales.
      
      let scaleMyYear = function (x){
            let ndate=new Date(); 
            let year = ndate.setFullYear(x.Year);
            return xScale(year);
      }

      let scaleMyTime = function(x){
            let timeslpited= x.Time.split(':');
            let newtime = new Date(1970, 0, 1, 0, timeslpited[0], timeslpited[1]);
            let yvalue = yScale(newtime);
            return yvalue;
      }


      //--
  
      //διαλέγω σε ποιο σημείο του DOM θα εμφανιστεί και τον τίτλο του διαγράμματος--
      const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);

      
            
            svg.append("text")
                  .attr("x", w/2)             
                  .attr("y", 20)
                  .attr("id", "title")
                  .text("Doping in Professional Bicycle RacingSA's")
                  .attr("anchor", "middle")
                  .attr("class", "title")
                  .attr("text-anchor", "middle");  
                  //     .style("font-size", "21px") 
                  //     .style("color", "white");
      //--

      //εδω φτιαχνω το legend
      
      const legend = d3.select("body")
                        .append('div')
                        .attr('id', 'legend')
                        .attr('class', 'legend')
                        .append('text')
                        .text("Year - Time ellapsed, ")
                        .append('text')
                        .text("Red = Doping accusations, Green= No doping accusations")
                        
      //--
      

      //φτιάχνω/εμφανίζω τους δύο άξονες--
      svg.append("g")
            .attr("transform", "translate(0," + (h-padding) +")")
            .attr("id", "x-axis")
            .call(xAxis);

      svg.append("g")
            .attr("transform", "translate(" + padding + ", 0)")
            .attr("id", "y-axis")
            .call(yAxis);

      //--
      



      //φτιάχνω/εμφανίζω τα δεδομένα-dots για κάθε ποδηλάτη--
      svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("r", 4)
            .attr("cx", d => scaleMyYear(d))
            .attr('cy', d => scaleMyTime(d))
            .attr("class", "dot") //να το κανω function ολο το αμεσως αποπάνω ώστε να μην χρειάζεται να κάνω όλο αυτό. Αλλωστε γι αυτό ακριβώς είναι τα functions, για να μην χρειάεται να επανλαμβάνεις κάθε φορά μια σειρά λειτουργιών αλλά για να την πραγματοποιεί αυτή για εσένα.
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => new Date(d.Seconds * 1000))
            .attr("Name", d=> d.Name)
            .attr("Doping", d=> d.Doping)
            .attr("class", "dot")
            .attr('fill', d => {if(d.Doping != ""){
                  return "red"
            }else{
                  return "lightgreen"
            }
            })
            .on('mouseover', (d) => {var x = d.srcElement.__data__;
                                    tooltip.transition()
                                          .style("visibility", "visible")
                                    if (x.Doping != "") {
                                          tooltip.text(x.Name + " - " + x.Year + "  - Doping Allegations!!")
                                    } else {
                                          tooltip.text(x.Name + " - " + x.Year + "   - No Allegations")
                                    }

                                          tooltip.attr("data-year", x.Year)
                        
                              }
            )
                                    
            .on('mouseout', (d) => 
                  tooltip.transition()
                        .style('visibility', 'hidden') 
            )
      

      //εδω είναι το tooltip των dots δηλαδή οι ταμπελιτσες πληροφοριων που θα εμφανίζονται οταν κάνουμε χοβερ πανω στις ντοτς.

      const tooltip = d3.select("body")
                        .append("div")
                        .attr("id", "tooltip")
                        .attr("class", "tooltip")
                        
                                
     
      
                        
      
                              
};

