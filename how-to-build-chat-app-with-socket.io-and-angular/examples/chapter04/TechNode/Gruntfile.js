module.exports = function (grunt) {
  grunt.initConfig({
    useminPrepare: {
      html: 'static/index.html',
      options: {
        dest: 'build'
      }
    },
    usemin: {
      html: 'build/index.html'
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'static/components/bootstrap/dist/fonts/', src: ['**'], dest: 'build/fonts'},
          {expand: true, cwd: 'static/pages/', src: ['**'], dest: 'build/pages'},
          {'build/index.html': 'static/index.html'},
          {'build/favicon.ico': 'static/favicon.ico'}
        ]
      }
    }
  })
  grunt.loadNpmTasks('grunt-usemin')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('default', [
    'copy',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'usemin'
  ])
}