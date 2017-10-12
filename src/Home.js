import React from "react"

import {
  Row,
  Grid,
  Col,
  Panel
} from "components"

const Home = () => <Grid>
  <Row>
    <Col md={6}>
      <Panel header={<h3>Rajasthan</h3>}>
        Literally cornhole pour-over slow-carb, wolf actually keffiyeh chia wayfarers YOLO. Chicharrones tilde unicorn freegan readymade everyday carry. Messenger bag flexitarian narwhal kombucha, typewriter cornhole yuccie chambray leggings YOLO fam 8-bit single-origin coffee paleo. Meditation umami hell of beard, snackwave pabst synth shabby chic kombucha
      </Panel>
    </Col>
    <Col md={6}>
      <Panel header={<h3>Sikkim</h3>}>
        Activated charcoal butcher lumbersexual tbh iceland keytar kombucha. Kombucha cray pok pok, direct trade cred yr woke artisan flexitarian. Artisan ramps poke yr PBR&B mixtape. Butcher raw denim yuccie whatever kale chips VHS chambray polaroid church-key put a bird on it pop-up heirloom
      </Panel>
    </Col>
  </Row>
</Grid>

export default Home
