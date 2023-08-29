using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AccountsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DbContext _context;
        private AccountBusiness _business;

        public AccountController(DbContext context)
        {
            _context = context;
            _business = new AccountBusiness(_context);
        }

        // GET: api/Account
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, AccountView>> GetAccounts([FromQuery] AccountQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Account/5
        [HttpGet("{id}")]
        public ActionResult<AccountView> GetAccount(Guid id)
        {
            if (_context.Accounts == null)
            {
                return NotFound();
            }

            var account = _business.GetById(id);

            if (account == null)
            {
                return NotFound();
            }

            return account;
        }

        // PUT: api/Account/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<AccountView> PutAccount(Guid id, AccountUpdate account)
        {
            try 
            {
                var existingAccount = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, account);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Account/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<AccountView> PatchAccount(Guid id, JsonElement account)
        {
            try 
            {
                var existingAccount = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, account);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Account
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<AccountView> PostAccount(AccountCreate account)
        {
            var created = _business.Create(account);

            return created;
        }

        // DELETE: api/Account/5
        [HttpDelete("{id}")]
        public ActionResult<AccountView> DeleteAccount(Guid id)
        {
            try 
            {
                var existingAccount = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool AccountExists(Guid id)
        {
            return (_context.Set<Account>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
