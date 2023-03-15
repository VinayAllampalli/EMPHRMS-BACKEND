    const fs = require('fs');
    const { Builder } = require('xml2js');
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser();
    
    fs.readFile('C:/Users/Lotus/Desktop/XML/testfile.xml', function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      const cleanData = data.toString().replace()
    
      parser.parseString(data, function (err, result) {
        if (err) {
          console.log(err);
          return; 
        }
    
        const groups = result.ENVELOPE.BODY[0].DATA[0].COLLECTION[0].GROUP;
        // console.log(groups);
    
        const target = {
          ENVELOPE: {
            HEADER: {
              TALLYREQUEST: "Import Data"
            },
            BODY: {
              IMPORTDATA: {
                REQUESTDESC: {
                  REPORTNAME: "All Masters",
                  STATICVARIABLES: {
                    SVCURRENTCOMPANY: "Phoenix Scientific Suppliers"
                  }
                },
                REQUESTDATA: {
                  TALLYMESSAGE: {
                    GROUPS: {
                      GROUP: groups
                    }
                  }
                }
              }
            }
          }
        };
    
        const builder = new Builder();
        const targetXml = builder.buildObject(target);
    
        // console.log("---------------------------------->", targetXml);
    
        fs.writeFile('output.xml', targetXml, (err) => {
          if (err) throw err;
          console.log('XML document saved to file!');
        }); 
      });
    });