module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/unit/**/*.test.js'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverage: true,  // Habilita la cobertura
  coverageDirectory: 'coverage',  // Carpeta donde se guardará el coverage
  coverageReporters: ['json', 'lcov', 'text', 'clover'],  // Tipos de reportes
  collectCoverageFrom: [
    'src/**/*.js',  // Asegura que mida coverage de todo el código fuente
    '!src/index.js',  // Puedes excluir archivos específicos si es necesario
  ],
};
