import React from "react"

import {
  Jumbotron,
  Grid
} from "components"

export const E404 = ({ location }) =>(
  <Jumbotron>
    <Grid>
      <h1>404!! No match for <code>{location.pathname}</code></h1>
    </Grid>
  </Jumbotron>
  )

export default E404
