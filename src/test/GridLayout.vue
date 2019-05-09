<template>
<div>

  <v-toolbar dark color="primary">
    <v-toolbar-side-icon></v-toolbar-side-icon>
    <v-toolbar-title class="white--text">Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>

    <v-checkbox
        v-model="checkbox"
        :label="`Keep it small?: ${checkbox.toString()}`"
    ></v-checkbox>

  <v-container fluid>
    <v-layout row>
      <v-flex xs6 order-lg2>
        <v-card dark tile flat color="error">
          <v-card-text>#1... 1</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card dark tile flat color="red darken-4">
          <v-card-text>#2... 2</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4 order-md2 order-xs1>
        <v-card dark tile flat color="red lighten-1">
          <v-card-text>#1... 3</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs4 order-md3 order-xs2>
        <v-card dark tile flat color="red lighten-2">
          <v-card-text>#2... 4</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs4 order-md1 order-xs3>
        <v-card dark tile flat color="red darken-1">
          <v-card-text>#3... 5</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 sm6 md3 order-md4 order-sm2>
        <v-card dark tile flat color="red darken-2">
          <v-card-text>#1... 6</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md3 order-md3 order-sm1>
        <v-card dark tile flat color="deep-orange lighten-1">
          <v-card-text>#2... 7</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md3 order-md2 order-sm4>
        <v-card dark tile flat color="deep-orange darken-3">
          <v-card-text>#3... 8</v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md3 order-md1 order-sm3>
        <v-card dark tile flat color="deep-orange">
          <v-card-text>#4... 9</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  <v-container grid-list-xl text-xs-center>
    <v-layout row wrap>
      <v-flex
        v-bind="{
            [`xs10`]: checkbox,
            [`offset-xs1`]: checkbox,
            [`xs12`]: !checkbox
        }"
        >
        <v-card dark color="purple">
          <v-card-text>xs10 offset-xs1</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs7 offset-xs5 offset-md2 offset-lg5>
        <v-card dark color="secondary">
          <v-card-text>xs7 offset-(xs5 | md2 | lg5)</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md3>
        <v-card dark color="primary">
          <v-card-text>(xs12 | sm5 | md3)</v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 sm5 md5 offset-xs0 offset-lg2>
        <v-card dark color="green">
          <v-card-text>(xs12 | sm5 | md5) offset-(xs0 | lg2)</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  <v-container fluid>
    <v-layout row>
      <v-flex
        grow
        pa-1
      >
        <v-card
          dark
          color="green darken-3"
        >
          <v-card-text>#1 Im a Grow Flex</v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        shrink
        pa-1
      >
        <v-card
          dark
          color="green darken-1"
        >
          <v-card-text>#2 Im a Shrink Flex</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        grow
        pa-1
      >
        <v-card
          dark
          color="green darken-1"
        >
          <v-card-text>#1 Im a Grow Flex</v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        shrink
        pa-1
      >
        <v-card
          dark
          color="green lighten-1"
        >
          <v-card-text>#2 Im a Shrink Flex</v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        grow
        pa-1
      >
        <v-card
          dark
          color="green darken-4"
        >
          <v-card-text>#3 Im a Grow Flex</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        shrink
        pa-1
      >
        <v-card
          dark
          color="green darken-3"
        >
          <v-card-text>#1 Im a Shrink Flex</v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        grow
        pa-1
      >
        <v-card
          dark
          color="green"
        >
          <v-card-text>#2 Im a Grow Flex</v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        shrink
        pa-1
      >
        <v-card
          dark
          color="green lighten-1"
        >
          <v-card-text>#3 Im a Shrink Flex</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>


  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex d-flex xs12 sm6 md4>
        <v-card color="purple" dark>
          <v-card-title primary class="title">Lorem</v-card-title>
          <v-card-text>{{ lorem }}</v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm6 md3>
        <v-layout row wrap>
          <v-flex d-flex>
            <v-card color="indigo" dark>
              <v-card-text>{{ lorem.slice(0, 70) }}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex d-flex>
            <v-layout row wrap>
              <v-flex
                v-for="n in 2"
                :key="n"
                d-flex
                xs12
              >
                <v-card
                  color="red lighten-2"
                  dark
                >
                  <v-card-text>{{ lorem.slice(0, 40) }}</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex d-flex xs12 sm6 md2 child-flex>
        <v-card color="green lighten-2" dark>
          <v-card-text>{{ lorem.slice(0, 90) }}</v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm6 md3>
        <v-card color="blue lighten-2" dark>
          <v-card-text>{{ lorem.slice(0, 100) }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>


  <v-container fluid grid-list-sm>
    <v-layout row wrap>
      <v-flex d-flex xs12 order-xs5>
        <v-layout column>
          <v-flex d-flex>
            <v-card color="blue-grey" dark tile flat>
              <v-card-text>{{ lorem }}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex d-flex>
            <v-card color="brown" dark tile flat>
              <v-card-text>{{ lorem }}</v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex d-flex xs12 sm7>
        <v-layout row wrap>
          <v-flex d-flex>
            <v-card color="indigo lighten-2" dark tile flat>
              <v-card-text>{{ lorem.slice(0, 70) }}</v-card-text>
            </v-card>
          </v-flex>
          <v-flex d-flex>
            <v-layout row>
              <v-flex
                v-for="n in 2"
                :key="n"
                d-flex
              >
                <v-card
                  color="amber lighten-2"
                  tile
                  flat
                >
                  <v-card-text>{{ lorem.slice(0, 40) }}</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex d-flex xs12 sm2 child-flex>
        <v-card color="orange lighten-2" tile flat>
          <v-card-text>{{ lorem.slice(0, 90) }}</v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex xs12 sm3>
        <v-card color="red lighten-2" dark tile flat>
          <v-card-text>{{ lorem.slice(0, 100) }}</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

</div>
</template>

<script>
  export default {
    data: () => ({
        checkbox: false,
        lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`
    }),
    computed: {
        isTwoColumn: function() {
            return this.checkbox;
        }
    }
  }
</script>

