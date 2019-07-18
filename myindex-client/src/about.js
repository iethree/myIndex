import React from 'react';

export function About(props){
  return(
    <HalfWrapper>
      <Explanation title="About myIndex">
        This is a project born of a love for graphs and wondering about how weird combinations of companies' stocks are performing in the aggregate. Indexes are weighted by market capitalization. The y-axis is percent change.
      </Explanation>
      <Explanation title="Disclaimer">
         Don't even think about relying on this for any sort of financial transaction.
      </Explanation>
      <Explanation title="Data">
         Data provided for free by <a href="https://iextrading.com/developer/">IEX</a>. View IEX's <a href="https://iextrading.com/api-exhibit-a/">terms of use</a>.
      </Explanation>
    </HalfWrapper>
  );
}

function HalfWrapper(props){
   return(
      <div className="columns is-centered">
         <div className = "column is-half">
            {props.children}
         </div>
      </div>
   );
}

function Explanation(props){
  return(
    <div className="explanation">
      <h4 className="title is-4">{props.title}</h4>
      <p className="content">
        {props.children}
      </p>
    </div>
  );
}