using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RolepermissionsApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolepermissionController : ControllerBase
    {
        private readonly DbContext _context;
        private RolepermissionBusiness _business;

        public RolepermissionController(DbContext context)
        {
            _context = context;
            _business = new RolepermissionBusiness(_context);
        }

        // GET: api/Rolepermission
        [HttpGet]
        public ActionResult<QueryResult<ClientQuery, RolepermissionView>> GetRolepermissions([FromQuery] RolepermissionQuery query)
        {
            var dataQuery = _business.ConvertToDataQuery(query);

            var result = _business.GetAll(query, dataQuery);
            return result;
        }

        // GET: api/Rolepermission/5
        [HttpGet("{id}")]
        public ActionResult<RolepermissionView> GetRolepermission(Guid id)
        {
            if (_context.Rolepermissions == null)
            {
                return NotFound();
            }

            var rolePermission = _business.GetById(id);

            if (rolePermission == null)
            {
                return NotFound();
            }

            return rolePermission;
        }

        // PUT: api/Rolepermission/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public ActionResult<RolepermissionView> PutRolepermission(Guid id, RolepermissionUpdate rolePermission)
        {
            try 
            {
                var existingRolepermission = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Update(id, rolePermission);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolepermissionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

        }

        // PATCH: api/Rolepermission/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        public ActionResult<RolepermissionView> PatchRolepermission(Guid id, JsonElement rolePermission)
        {
            try 
            {
                var existingRolepermission = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            try
            {
                var updated = _business.Modify(id, rolePermission);
                return updated;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolepermissionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            
        }

        // POST: api/Rolepermission
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<RolepermissionView> PostRolepermission(RolepermissionCreate rolePermission)
        {
            var created = _business.Create(rolePermission);

            return created;
        }

        // DELETE: api/Rolepermission/5
        [HttpDelete("{id}")]
        public ActionResult<RolepermissionView> DeleteRolepermission(Guid id)
        {
            try 
            {
                var existingRolepermission = _business.GetById(id);
            } 
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

            var deleted =_business.Delete(id);

            return deleted;
        }

        private bool RolepermissionExists(Guid id)
        {
            return (_context.Set<Rolepermission>().Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
