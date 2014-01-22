module.exports = function (grunt) {
  grunt.initConfig({
    useminPrepare: {
      html: 'static/index.html',
      options: {
        dest: 'build'
      }
    },
    usemin: {
      html: 'static/index.html'
    }
  })
  grunt.loadNpmTasks('grunt-usemin')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')

  grunt.registerTask('default', [
      'useminPrepare',
      'concat',
      'uglify',
      'cssmin',
      'usemin'
  ])
}