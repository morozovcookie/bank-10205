      var ProductCategoryRow = React.createClass({
        render: function() { 
          return (<tr><th colSpan="2">{this.props.category}</th></tr>);
        }
      });

      var ProductRow = React.createClass({
        render: function() {
          var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color: 'red'}}>
              {this.props.product.name}
            </span>;

          return (
            <tr>
              <td>{name}</td>
              <td>{this.props.product.price}</td>
            </tr>
          );
        }
      });

      var ProductTable = React.createClass({
        render: function() {
          var rows = [];
          var lastCategory = null;
          this.props.products.forEach(function(product) {
            if (product.name.indexOf(this.props.filterText) === -1 || 
                (!product.stocked && this.props.inStockOnly)) {
              return;
            }
            if (product.category !== lastCategory) {
              rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
          }.bind(this));

          return ( 
            <table> 
              <thead> 
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                </tr> 
              </thead>
              <tbody>{rows}</tbody>
            </table>
          );
        }
      });

      var SearchBar = React.createClass({
        handleChange: function(e) {
          this.props.onUserInput(
            // we can use event to catch changes, but with it we catch only one
            // target input.
            this.refs.filterTextInput.value,
            this.refs.inStockOnlyInput.checked
          );
          console.log(e);
        },
        render: function(){
          return (
            <form>
              <input
                type="text"
                placeholder="search..."
                value={this.props.filterText}
                ref="filterTextInput"
                onChange={this.handleChange}
              />
              <p>
                <input 
                  type="checkbox"
                  checked={this.props.inStockOnly}
                  ref="inStockOnlyInput"
                  onChange={this.handleChange}
                />
                {' '}
                Only show products in stock
              </p>
            </form>
            );
        }
      });

      var FilterableProductTable = React.createClass({
        getInitialState: function() {
          return { 
            filterText: '',
            inStockOnly: false
          };
        },

        handleUserInput: function(filterText, inStockOnly) {
          this.setState({
            filterText: filterText,
            inStockOnly: inStockOnly
          });
        },
        
        render: function() {
          return (
            <div>
              <SearchBar
                filterText={this.state.filterText}
                inStockOnly={this.state.inStockOnly}
                onUserInput={this.handleUserInput}
              />
              <ProductTable
                products={this.props.products}
                filterText={this.state.filterText}
                inStockOnly={this.state.inStockOnly}
              />
            </div>
          );
        }
      });

      var PRODS = [
        {category: 'Sporting Goods', price: '$49.90',  stocked: true,  name: 'Footbal' },
        {category: 'Sporting Goods', price: '$9.90',   stocked: true,  name: 'Baseball' },
        {category: 'Sporting Goods', price: '$99.90',  stocked: false, name: 'Basketball' },
        {category: 'Electronics',    price: '$8.00',   stocked: true,  name: 'Ipod Touch' },
        {category: 'Electronics',    price: '$5.90',   stocked: false, name: 'IPhone 5' },
        {category: 'Electronics',    price: '$149.90', stocked: true,  name: 'Nexus 7' }
      ];

      ReactDOM.render(
        <FilterableProductTable products={PRODS}/>,
        document.getElementById('container')
      );

