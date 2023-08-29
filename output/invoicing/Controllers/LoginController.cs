using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LoginsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DbContext _context;
        private LoginBusiness _business;

        public LoginController(DbContext context)
        {
            _context = context;
            _business = new LoginBusiness(_context);
        }

        // GET: api/Login
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, LoginView>> GetLogins([FromQuery] LoginQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Login/5
        [HttpGet("{id}")]
        public ActionResult<LoginView> GetLogin(Guid id)
        {
            if (_context.Logins == null)
            {
                return NotFound();
            }

            var login = _business.GetById(id);

            if (login == null)
            {
                return NotFound();
            }

            return login;
        }

        // PUT: api/Login/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<LoginView> PutLogin(Guid id, LoginUpdate login)
        {
            try 
            {
                var existingLogin = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, login);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoginExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Login/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<LoginView> PatchLogin(Guid id, JsonElement login)
        {
            try 
            {
                var existingLogin = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, login);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LoginExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Login
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<LoginView> PostLogin(LoginCreate login)
        {
            var created = _business.Create(login);

            return created;
        }

        // DELETE: api/Login/5
        [HttpDelete("{id}")]
        public ActionResult<LoginView> DeleteLogin(Guid id)
        {
            try 
            {
                var existingLogin = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool LoginExists(Guid id)
        {
            return (_context.Set<Login>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
