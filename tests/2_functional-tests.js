/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id = "";

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
/*
  // TEST #0 -
  test('#example Test GET /api/books', function(done){
     chai
      .request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
*/

  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
  // TEST #1 -
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .post('/api/books')
        .send({
          title: "Hidden in Plain Sight"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.title, "Hidden in Plain Sight");
          assert.isNotNull(res.body._id)
          id = res.body._id;
    //      console.log("id has been set as" + id);
          console.log(`id has been set as ${id}`);
          done()
        })
      });

  // TEST #2 -    
      test('Test POST /api/books with no title given', function(done) {
        //done();
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.body, 'missing required field title')
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
  // TEST #3 -    
      test('Test GET /api/books',  function(done){
        chai        
        .request(server)
        .get('/api/books')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain comments' );
          assert.property(res.body[0], 'title', 'Books in array should contain title' );
          assert.property(res.body[0], '_id', 'Books in array should contain _id' );
          done();
        })        
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
  // TEST #4 -   
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get("/api/books/" + 'idthatdoesntexist')
          .end((err, res) => {
            assert.equal(res.body, 'no book exists')
            done()
          });
      });
  // TEST #5 -    
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .get('/api/books/' + id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, "Hidden in Plain Sight")
            assert.propertyVal(res.body, '_id', id)
            assert.property(res.body, 'comments')
            assert.isArray(res.body.comments)
            done();
          })       
      });     
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
  // TEST #6 -    
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post('/api/books/' + id)
          .send({
            comment: 'test comment'
          })
          .end((err, res) => {
            console.log('Response from comment post')
            console.log(res.body)
            console.log(id)
            assert.isTrue(res.body.comments.includes('test comment'))
          })

        done();
      });

  // TEST #7 -
      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + id)
          .send({
            comment: ''
          })
          .end(function(err, res){
            assert.equal(res.status, 200)
            assert.equal(res.body, 'missing required field comment')
         //   assert.isFalse(res.body.comments.includes(res.body.comment))
            done()

        })
      });
  // TEST #8 -
      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post('/api/books/'+ "invalidId")
          .send(
            {comment: 'test with comment, without valid id'})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body, 'no book exists')
          })
          done()
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
  // TEST #9 -
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete('/api/books/' + id)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.body, 'delete successful')
            done()
          })
      });
  // TEST #10 -
      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete("/api/books/" + "invalid id")
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body, 'no book exists')
          done()
        })    
      });

    });

  });

});
