<template>
  <v-container fluid grid-list-xl>
    <v-layout wrap align-center>
      <v-flex xs12 sm6 d-flex>
        <v-select
          :items="items"
          label="Standard"
          @change="setSelected"
        ></v-select>
      </v-flex>

      <v-flex xs12 sm6 d-flex>
        <v-select
          :items="items"
          box
          label="Box style"
        ></v-select>
      </v-flex>

      <v-flex xs12 sm6 d-flex>
        <v-select
          :items="items"
          label="Outline style"
          outline
        ></v-select>
      </v-flex>

      <v-flex xs12 sm6 d-flex>
        <v-select
          :items="items"
          label="Solo field"
          solo
        ></v-select>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      // items: ['Foo', 'Bar', 'Fizz', 'Buzz']
        items: [{text:'Foo', value: 'foo'}, {text: 'Bar', value: 'bar'}, {text:'Fizz', value:'fizz'}, {text:'Buzz',value:'buzz'}]

    }),
    methods: {
        setSelected: function(selected) {
            alert(selected);
        }
    }
  }
</script>
