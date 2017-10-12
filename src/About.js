import React from "react"
import {
  Grid,
  Panel,
} from 'components';

const About = () => <Grid>
  <Panel bsStyle="primary" className="text-center">
    <h3 className="text-uppercase">TEAM</h3>
    <p className="text-muted">
    Tourepedia team comprises expert travellers and writers, efficient trip planers, hardworking creative team, online support crew and our collaborating vendors. With this family of creative and enthusiastic team we live by the words, " You dream, we plan and make it happen."
    </p>
    <hr/>

    <h3 className="text-uppercase">MISSION</h3>
    <p className="text-muted">
    To provide personalized trips with flexibility at customer's budget, inspire the people to travel, cultivating eco-tourism.
    </p>
    <hr/>
    <h3 className="text-uppercase">VISION</h3>
    <p className="text-muted">
      To enhance travel experiences and unfolding the new dimensions in tourism
    </p>
    <hr/>
    <h3 className="text-uppercase">VALUES</h3>
    <p className="text-muted">
      Tourepedia is driven completely on customer satisfaction. We understand the power of trust which seals our bond with the customers and travel partners. Customers and travel partners are family to us and we welcome their every suggestion and happiness. Giving back happiness is what we do.
    </p>

  </Panel>
</Grid>

export default About
